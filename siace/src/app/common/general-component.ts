import { LocationStrategy } from "@angular/common";
import { Component } from "@angular/core";
import { ApplicationUser } from "../login/login.service";

@Component(
   {template: `
   <div>
      Clase base
   </div>
   `})
export class GeneralComponent{

   user!: ApplicationUser;

   constructor(protected locationStrategy: LocationStrategy) {
      //Recupera el usuario que ha sido logueado
      this.user=JSON.parse(localStorage.getItem("user")!);
      console.log('usuario: ', this.user);
      
      history.pushState(null, 'null', window.location.href);
      this.locationStrategy.onPopState(() => {
         history.pushState(null, 'null', window.location.href);
      });  

   }
}