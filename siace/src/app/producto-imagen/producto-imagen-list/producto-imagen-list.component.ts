import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoImagenFilter } from '../producto-imagen-filter';
import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';
import { ProductoImagenEditComponent } from '../producto-imagen-edit/producto-imagen-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-producto-imagen',
   standalone: false,
   templateUrl: 'producto-imagen-list.component.html',
   styles: [
      'table { min-width: 600px }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class ProductoImagenListComponent implements OnInit {
   displayedColumns = [ 'priId',  'priNombre',  'priProId',  'priTimId',  'actions'];
   filter = new ProductoImagenFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private productoImagenService: ProductoImagenService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.productoImagenService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.priId='0';
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get productoImagenList(): ProductoImagen [] {
      return this.productoImagenService.productoImagenList;
   }

   
   /* Métodos */

   add() {
      let newProductoImagen: ProductoImagen = new ProductoImagen();

      this.edit(newProductoImagen);
   }



   delete (productoImagen: ProductoImagen): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el producto imagenes?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.productoImagenService.delete(productoImagen).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El producto imagenes ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.productoImagenService.setIsUpdated(true);
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


   edit(ele: ProductoImagen) {
      this.dialog.open(ProductoImagenEditComponent, {
         data: {productoImagen:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.productoImagenService.load(this.filter);
   }
   
}
