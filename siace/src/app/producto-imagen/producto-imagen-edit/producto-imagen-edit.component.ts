import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-producto-imagen-edit',
   standalone: false,
   templateUrl: './producto-imagen-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class ProductoImagenEditComponent implements OnInit {

   id!: string;
   productoImagen!: ProductoImagen;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ProductoImagenEditComponent>,
      private productoImagenService: ProductoImagenService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productoImagen=data.productoImagen;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.productoImagenService.save(this.productoImagen).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El producto imagenes ha sido guardado exitosamente', 'Transacción exitosa');
               this.productoImagenService.setIsUpdated(true);
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
