import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { CuentaBancariaService } from '../cuenta-bancaria.service';
import { CuentaBancaria } from '../cuenta-bancaria';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-cuenta-bancaria-edit',
   standalone: false,
   templateUrl: './cuenta-bancaria-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class CuentaBancariaEditComponent implements OnInit {

   id!: string;
   cuentaBancaria!: CuentaBancaria;
   sucursalList: any[] = [];
   bancoList: any[] = [];

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<CuentaBancariaEditComponent>,
      private cuentaBancariaService: CuentaBancariaService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.cuentaBancaria=data.cuentaBancaria;
      this.sucursalList=data.sucursalList;
      this.bancoList=data.bancoList;
   }


   ngOnInit() {
   }

   OnSucursalChange(event:any){
      this.cuentaBancaria.cubSucId=event.value;
   }

   OnBancoChange(event:any){
      this.cuentaBancaria.cubBanId = event.value; 
   }
   /*Métodos*/
   
   save() {
      this.cuentaBancariaService.save(this.cuentaBancaria).subscribe({
         next:  result => {
            //    if (result?.banId !== undefined && result?.banId !== null && Number(result.banId) >= 0) {
            if (result.cubId !== undefined && result?.cubId !== null && Number(result.cubId) >= 0) {
               this.toastr.success('El cuenta bancaria ha sido guardado exitosamente', 'Transacción exitosa');
               this.cuentaBancariaService.setIsUpdated(true);
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
