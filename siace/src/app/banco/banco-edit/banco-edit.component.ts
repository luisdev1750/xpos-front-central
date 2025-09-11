import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BancoService } from '../banco.service';
import { Banco } from '../banco';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-banco-edit',
   standalone: false,
   templateUrl: './banco-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class BancoEditComponent implements OnInit {

   id!: string;
   banco!: Banco;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<BancoEditComponent>,
      private bancoService: BancoService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.banco = { ...data.banco };
      
  
   }

   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      // El valor ya es booleano, no necesita conversión adicional
      this.bancoService.save(this.banco).subscribe({
         next: result => {
            if (result?.banId !== undefined && result?.banId !== null && Number(result.banId) >= 0) {
               this.toastr.success('El banco ha sido guardado exitosamente', 'Transacción exitosa');
               this.bancoService.setIsUpdated(true);
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