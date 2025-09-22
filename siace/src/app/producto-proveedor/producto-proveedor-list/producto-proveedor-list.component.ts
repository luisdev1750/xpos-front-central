import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoProveedorFilter } from '../producto-proveedor-filter';
import { ProductoProveedorService } from '../producto-proveedor.service';
import { ProductoProveedor } from '../producto-proveedor';
import { ProductoProveedorEditComponent } from '../producto-proveedor-edit/producto-proveedor-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-producto-proveedor',
   standalone: false,
   templateUrl: 'producto-proveedor-list.component.html',
   styles: [
      'table { min-width: 600px }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class ProductoProveedorListComponent implements OnInit {
   displayedColumns = [ 'prvProId',  'prvPveId',  'prvUnmId',  'prvPrecio',  'actions'];
   filter = new ProductoProveedorFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private productoProveedorService: ProductoProveedorService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.productoProveedorService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.prvProId='0';
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get productoProveedorList(): ProductoProveedor [] {
      return this.productoProveedorService.productoProveedorList;
   }

   
   /* Métodos */

   add() {
      let newProductoProveedor: ProductoProveedor = new ProductoProveedor();

      this.edit(newProductoProveedor);
   }



   delete (productoProveedor: ProductoProveedor): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el producto por proveedor?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.productoProveedorService.delete(productoProveedor).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El producto por proveedor ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.productoProveedorService.setIsUpdated(true);
                  }
                  else this.toastr.error('Ha ocurrido un error', 'Error');
               },
               error: err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            });
         }
      });
   }


   edit(ele: ProductoProveedor) {
      this.dialog.open(ProductoProveedorEditComponent, {
         data: {productoProveedor:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.productoProveedorService.load(this.filter);
   }
   
}
