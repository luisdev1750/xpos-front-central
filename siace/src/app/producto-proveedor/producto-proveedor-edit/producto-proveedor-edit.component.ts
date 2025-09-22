import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoProveedorService } from '../producto-proveedor.service';
import { ProductoProveedor } from '../producto-proveedor';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-producto-proveedor-edit',
   standalone: false,
   templateUrl: './producto-proveedor-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class ProductoProveedorEditComponent implements OnInit {

   id!: string;
   productoProveedor!: ProductoProveedor;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ProductoProveedorEditComponent>,
      private productoProveedorService: ProductoProveedorService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productoProveedor=data.productoProveedor;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.productoProveedorService.save(this.productoProveedor).subscribe({
         next:  result => {
            if (Number(result) > 0) {
               this.toastr.success('El producto por proveedor ha sido guardado exitosamente', 'Transacción exitosa');
               this.productoProveedorService.setIsUpdated(true);
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
