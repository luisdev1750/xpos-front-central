import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RouteValidator } from '../common/route-validator';

@Injectable()
export class NextGuardService implements CanActivate  {

   constructor(private router: Router) { 
   }


   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if(!RouteValidator.isNextStep) {
         this.router.navigate(['']);
         return of(false);
      }
      else return of(true);
   }
}
