import { LocationStrategy } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { GeneralComponent } from "./general-component";
import { EmprendedorFilter } from "../emprendedor/emprendedor-filter";
import { EmprendedorService } from "../emprendedor/emprendedor.service";
import { Emprendedor } from "../emprendedor/emprendedor";

@Component(
   {template: `
   <div>
      Clase con Emprendedores
   </div>
   `})
export class GlobalComponent extends GeneralComponent implements OnInit{
   protected empModel!:Emprendedor[];
   protected empId!:number;

   constructor(
      protected empService: EmprendedorService,
      protected override locationStrategy: LocationStrategy) {
      super(locationStrategy);
   }


   ngOnInit(): void { 
      let empFilter: EmprendedorFilter = new EmprendedorFilter();
      empFilter.empId='0';
      this.empService.find(empFilter, true).subscribe({
         next:async emps => {
            this.empModel = emps;
            this.empId=0;

            this.changeEmprendedor();
         },
         error: error => {
            alert(error.message);
         }
      });
   }
   

   changeEmprendedor(){}
}