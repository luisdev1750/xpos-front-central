import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PromocionObsequioService } from '../promocion-obsequio.service';
import { PromocionObsequio } from '../promocion-obsequio';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-promocion-obsequio-edit',
   standalone: false,
   templateUrl: './promocion-obsequio-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class PromocionObsequioEditComponent implements OnInit {

   id!: string;
   promocionObsequio!: PromocionObsequio;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<PromocionObsequioEditComponent>,
      private promocionObsequioService: PromocionObsequioService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.promocionObsequio=data.promocionObsequio;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.promocionObsequioService.save(this.promocionObsequio).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El promoción obsequio ha sido guardado exitosamente', 'Transacción exitosa');
               this.promocionObsequioService.setIsUpdated(true);
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
