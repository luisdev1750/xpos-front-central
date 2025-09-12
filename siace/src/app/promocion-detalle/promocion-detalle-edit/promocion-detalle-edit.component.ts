import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PromocionDetalleService } from '../promocion-detalle.service';
import { PromocionDetalle } from '../promocion-detalle';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-promocion-detalle-edit',
   standalone: false,
   templateUrl: './promocion-detalle-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class PromocionDetalleEditComponent implements OnInit {

   id!: string;
   promocionDetalle!: PromocionDetalle;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<PromocionDetalleEditComponent>,
      private promocionDetalleService: PromocionDetalleService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.promocionDetalle=data.promocionDetalle;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.promocionDetalleService.save(this.promocionDetalle).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El detalle de promoción ha sido guardado exitosamente', 'Transacción exitosa');
               this.promocionDetalleService.setIsUpdated(true);
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
