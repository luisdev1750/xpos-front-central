import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { GeneralService } from '../common/general.service';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, delay, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResult {
   success: boolean;
   data: {
      accessToken: string;
      role: string;
      refreshToken: {
         userId: number;
         name: string,
         userName: string;
         tokenString: string;
         expireAt: string;
         usrNombreComp: string;
         blobToken: string;
         empId: number;
         empRazonSocial: string;
      }
   };
   errors: { code: number; source: string; title: string; detail: string };

   username: string;
   role: string;
   originalUserName: string;
   accessToken: string;
   refreshToken: string;
   usrNombreComp: string;
   blobToken: string;
   empId: number;
   empRazonSocial: string;
}


export interface ApplicationUser {
   userid: number;
   name: string;
   username: string;
   role: string;
   originalUserName: string;
   usrNombreComp: string;
   blobToken: string;
   empId: number;
   empRazonSocial: string;
}


@Injectable({ providedIn: 'root' })
export class LoginService extends GeneralService {
   private subject = new Subject<boolean>();
   private timer!: Subscription;
   private _user = new BehaviorSubject<ApplicationUser | null>(null);
   user$: Observable<ApplicationUser | null> = this._user.asObservable();

   constructor(private router: Router, private _http: HttpClient) {
      super();

      if (localStorage !== undefined && localStorage.getItem("user") !== undefined) {
         this.setIsLogin(true);
         let user: ApplicationUser = JSON.parse(localStorage.getItem("user")!);
         this._user.next(user);
         this.startTokenTimer();
      }

      // Escuchar el evento 'storage' para detectar cambios en el localStorage (como cerrar sesión)
      window.addEventListener('storage', this.handleStorageChange.bind(this));
   }

   // Método para manejar el evento de cambios en el localStorage
   private handleStorageChange(event: StorageEvent): void {
      if (event.key === 'user' && event.newValue === null) {
         // Si el valor de 'user' es eliminado (cerrar sesión), actualizamos el estado
         this.clearAll();
         console.log('Usuario desconectado en otra pestaña');
         // Redirigir o actualizar el estado, como redirigir al login o refrescar la página
         window.location.reload();
      }
   }

   /*Accesors */

   getIsLogin(): Observable<boolean> {
      return this.subject.asObservable();
   }

   setIsLogin(isLogin: boolean) {
      this.subject.next(isLogin);
   }

   /* Métodos de autenticación */

   clearLocalStorage() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
   }

   clearAll() {
      this.clearLocalStorage();
      this._user.next(null!);
      this.stopTokenTimer();
      this.setIsLogin(false);
   }

   private getTokenRemainingTime() {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
         return 0;
      }
      const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      return expires.getTime() - Date.now();
   }

   login(username: string, password: string) {
      return this._http
         .post<LoginResult>(this.sUrl + 'Account/login', { username, password, idsucursal: 1 })
         .pipe(
            map((usu) => {
                localStorage.setItem('accessToken', usu.data.accessToken);
               
               // let user: ApplicationUser = {
               //    userid: usu.data.refreshToken.userId,
               //    name: usu.data.refreshToken.name,
               //    username: usu.data.refreshToken.userName,
               //    role: usu.data.role,
               //    originalUserName: usu.data.refreshToken.userName,
               //    usrNombreComp: usu.data.refreshToken.usrNombreComp,
               //    empId: usu.data.refreshToken.empId,
               //    empRazonSocial: usu.data.refreshToken.empRazonSocial,
               //    blobToken: usu.data.refreshToken.blobToken
               // };
               // this._user.next(user);
               // this.setLocalStorage(usu, user);
               // this.startTokenTimer();
               // this.setIsLogin(true);
               //   localStorage.setItem('user', JSON.stringify(user));  
                 // Esto activará el evento 'storage'

               // Notificar a otras pestañas que el usuario ha iniciado sesión
             
               return usu;
            })
         );
   }

   logout() {
      this._http
         .post<unknown>(this.sUrl + 'Account/logout', {})
         .pipe(
            finalize(() => {
               this.clearAll();
               this.router.navigate(['/login']);
               window.location.reload();  // Se recarga la página
            })
         )
         .subscribe();
   }

   refreshToken() {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
         this.clearLocalStorage();
         this.setIsLogin(false);
         return of(null);
      }

      return this._http
         .post<LoginResult>(this.sUrl + 'Account/refresh', { refreshToken })
         .pipe(
            map((usu) => {
               if (usu && usu.data && usu.data.refreshToken) {
                  let user: ApplicationUser = {
                     userid: usu.data.refreshToken.userId,
                     name: usu.data.refreshToken.name,
                     username: usu.data.refreshToken.userName,
                     role: usu.data.role,
                     originalUserName: usu.data.refreshToken.userName,
                     usrNombreComp: usu.data.refreshToken.usrNombreComp,
                     empId: usu.data.refreshToken.empId,
                     empRazonSocial: usu.data.refreshToken.empRazonSocial,
                     blobToken: usu.data.refreshToken.blobToken
                  };
                  this._user.next(user);
                  this.setLocalStorage(usu, user);
                  this.startTokenTimer();
               } else {
                  this.clearAll();
               }
               return usu;
            })
         ).subscribe();
   }

   setLocalStorage(lgnRes: LoginResult, user: ApplicationUser) {
      localStorage.setItem('access_token', lgnRes.data.accessToken);
      localStorage.setItem('refresh_token', lgnRes.data.refreshToken.tokenString);
      localStorage.setItem('user', JSON.stringify(user));
   }

   private startTokenTimer() {
      const timeout = this.getTokenRemainingTime();
      this.timer = of(true)
         .pipe(
            delay(timeout),
            tap(() => this.refreshToken())
         )
         .subscribe();
   }

   private stopTokenTimer() {
      this.timer?.unsubscribe();
   }
}
