import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ListaPrecioService } from '../lista-precio.service';
import { ListaPrecio } from '../lista-precio';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-lista-precio-edit',
   standalone: false,
   templateUrl: './lista-precio-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class ListaPrecioEditComponent implements OnInit {

   id!: string;
   listaPrecio!: ListaPrecio;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ListaPrecioEditComponent>,
      private listaPrecioService: ListaPrecioService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.listaPrecio=data.listaPrecio;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.listaPrecioService.save(this.listaPrecio).subscribe({
         next:  result => {
            if (result?.lprId !== undefined && result?.lprId !== null && Number(result.lprId) >= 0) {
               this.toastr.success('El lista precios ha sido guardado exitosamente', 'Transacción exitosa');
               this.listaPrecioService.setIsUpdated(true);
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
