import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService, ApplicationUser } from '../login/login.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  user!: ApplicationUser;

  constructor(private auth_: LoginService, private router: Router) {
    // Inicializar el usuario del localStorage
    this.user = JSON.parse(localStorage.getItem('user')!);

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' && event.newValue) {
        this.user = JSON.parse(event.newValue);
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Verificar si el usuario está autenticado y si los valores coinciden
    return this.auth_.user$.pipe(
      map((user) => {
        if (!user || !this.isUserValid(user)) {
          // Aquí comprobamos que user no sea nul
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      catchError((e) => {
        console.log('Error' + e);
        return of(false);
      })
    );
  }

  private isUserValid(user: ApplicationUser): boolean {
    // Verificar si el usuario en el localStorage es válido y coincide con el estado actual
    if (!this.user || this.user.userid !== user.userid) {
      return false;
    }
    return true;
  }
}
