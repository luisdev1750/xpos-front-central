import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { FormulaContableService } from '../formula-contable.service';
import { FormulaContable } from '../formula-contable';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-formula-contable-edit',
   standalone: false,
   templateUrl: './formula-contable-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class FormulaContableEditComponent implements OnInit {

   id!: string;
   formulaContable!: FormulaContable;

   listSucursales: any = []; 
   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<FormulaContableEditComponent>,
      private formulaContableService: FormulaContableService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formulaContable=data.formulaContable;
      this.listSucursales = data.listSucursales; 
   }


   ngOnInit() {
   }

   OnSucursalChange(event: any){
      this.formulaContable.focSucId=event.value;
   }

   /*Métodos*/
   
   save() {
      this.formulaContableService.save(this.formulaContable).subscribe({
         next:  result => {
                 //    if (result?.banId !== undefined && result?.banId !== null && Number(result.banId) >= 0) {
            if (result.focId !== undefined && result?.focId !== null && Number(result.focId) >= 0) {
               this.toastr.success('El fórmula contable ha sido guardado exitosamente', 'Transacción exitosa');
               this.formulaContableService.setIsUpdated(true);
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
