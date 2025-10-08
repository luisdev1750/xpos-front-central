import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SucursalConfigService } from '../sucursal-config.service';
import { SucursalConfig } from '../sucursal-config';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SucursalService } from '../../sucursal/sucursal.service';

@Component({
   selector: 'app-sucursal-config-edit',
   standalone: false,
   templateUrl: './sucursal-config-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class SucursalConfigEditComponent implements OnInit {

   id!: string;
   sucursalConfig!: SucursalConfig;

   listSucursales: any[] = [];
   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<SucursalConfigEditComponent>,
      private sucursalConfigService: SucursalConfigService,
	   private toastr: ToastrService,
      private sucursalService: SucursalService, 
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.sucursalConfig=data.sucursalConfig;
   }


   ngOnInit() {
      this.loadCatalogs(); 
   }

   loadCatalogs(){
      this.sucursalService.findAll().subscribe((res)=>{
         console.log("all sucursales");
         console.log(res);
         this.listSucursales = res; 
         
         
      }, (error)=>{
         console.log(error);
         
      })
   }

   onSucursalChange(event: any){
      this.sucursalConfig.scoSucId = event.value; 
   }
   /*Métodos*/
   
     save() {
      this.sucursalConfigService.save(this.sucursalConfig).subscribe({
         
         next: result => {
            // Validación similar al BancoEditComponent
            if (result?.scoId !== undefined && result?.scoId !== null && Number(result.scoId) >= 0) {
               this.toastr.success('La configuración de sucursal ha sido guardada exitosamente', 'Transacción exitosa');
               this.sucursalConfigService.setIsUpdated(true);
               this.dialogRef.close();
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {   
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }
}
