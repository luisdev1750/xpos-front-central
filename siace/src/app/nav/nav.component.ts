import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Modulo } from '../modulo/modulo';
import { ModuloFilter } from '../modulo/modulo-filter';
import { ModuloService } from '../modulo/modulo.service';
import { ApplicationUser, LoginService } from '../login/login.service';

interface SideNavRoute {
   icon?: string;
   route?: string;
   title?: string;
}

@Component({
   selector: 'siace-nav',
   templateUrl: './nav.component.html',
   styleUrls: ['./nav.component.css']
})
export class SigaNavComponent implements OnInit, OnDestroy {
   private subscription!: Subscription;
   public modRoutes!: SideNavRoute[];

   public modModel!: Modulo[];
   public modParent!: Modulo[];
   isLogin!:boolean;


   /* Inicialización */

   constructor(private moduloService: ModuloService,
      private loginService: LoginService,
      private breakpointObserver: BreakpointObserver) {
   }


   ngOnDestroy(): void {
      this.subscription?.unsubscribe();
   }


   ngOnInit(): void {
      // Consulta los módulos
   
      this.subscription = this.loginService.user$.subscribe((usr) => {
         this.isLogin = usr !== undefined && usr !== null;
         if (this.isLogin) {
            let modFilter: ModuloFilter = new ModuloFilter();
            if (usr) {
               modFilter.rolId = usr.role;  // Acceder a usr.role solo si usr no es null ni undefined
               modFilter.modId = '0';
               this.moduloService.find(modFilter).subscribe(
                  {
                     next: (mods) => {
                        this.modModel = mods;
                        this.modParent = mods.filter(f => f.modModId == null);
                     },
                     error: (error) => {
                        alert(error.message);
                     }
                  }
               );
            }
         }
      });
   }
   


   /* Métodos */

   public getChildren(mod: Modulo): Modulo[]{
      return this.modModel.filter(f=>f.modModId==mod.modId);
   }


   isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
         map(result => result.matches),
         shareReplay()
      );


   public isAuthenticated() {
      return this.isLogin;
   }


   showSubmenu(mod: Modulo) {
      if(mod.modExpanded) mod.modExpanded=false;
      else mod.modExpanded=true;
   }
}
