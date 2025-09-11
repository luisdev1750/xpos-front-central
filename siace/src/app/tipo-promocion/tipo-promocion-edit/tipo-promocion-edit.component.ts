import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TipoPromocionService } from '../tipo-promocion.service';
import { TipoPromocion } from '../tipo-promocion';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-tipo-promocion-edit',
   standalone: false,
   templateUrl: './tipo-promocion-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class TipoPromocionEditComponent implements OnInit {

   id!: string;
   tipoPromocion!: TipoPromocion;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<TipoPromocionEditComponent>,
      private tipoPromocionService: TipoPromocionService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.tipoPromocion=data.tipoPromocion;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.tipoPromocionService.save(this.tipoPromocion).subscribe({
         next:  result => {
            if (result?.tprId !== undefined && result?.tprId !== null && Number(result.tprId) >= 0) {
               this.toastr.success('El tipo de promoción ha sido guardado exitosamente', 'Transacción exitosa');
               this.tipoPromocionService.setIsUpdated(true);
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
