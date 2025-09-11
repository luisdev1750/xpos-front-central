import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SucursalService } from '../sucursal.service';
import { Sucursal } from '../sucursal';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-sucursal-edit',
   standalone: false,
   templateUrl: './sucursal-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class SucursalEditComponent implements OnInit {

   id!: string;
   sucursal!: Sucursal;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<SucursalEditComponent>,
      private sucursalService: SucursalService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.sucursal=data.sucursal;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.sucursalService.save(this.sucursal).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El sucursal ha sido guardado exitosamente', 'Transacción exitosa');
               this.sucursalService.setIsUpdated(true);
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
