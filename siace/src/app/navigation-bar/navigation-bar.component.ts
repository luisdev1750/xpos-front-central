import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationUser, LoginService } from '../login/login.service';

@Component({
   selector: 'siga-navigation-bar',
   templateUrl: './navigation-bar.component.html',
   styleUrls: ['./navigation-bar.component.css']
})
export class SigaNavigationBarComponent implements OnInit, OnDestroy {

   @Output() toggleSidenav = new EventEmitter<void>();
   @Output() closeSidenav = new EventEmitter<void>();
   private returnUrl = '/';
   private subs!: Subscription;
   public isLogin!: boolean;
   usrNombreComp: string='';


   /* Inicialización */
   constructor(private loginService: LoginService) { 
      this.isLogin=false;
   }

   
   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }

   ngOnInit(): void {
      this.subs = this.loginService.user$.subscribe((usr) => {
         this.isLogin=usr!=undefined;
         if(this.isLogin) {
            this.usrNombreComp=usr==null?'':usr.usrNombreComp;
         }
         else this.loginService.logout();
      });
   }


   /* Métodos */

   public logout() {
      this.closeSidenav.emit();
      this.loginService.logout();
   }

}
