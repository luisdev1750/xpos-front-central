import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalProductoFilter } from '../sucursal-producto-filter';
import { SucursalProductoService } from '../sucursal-producto.service';
import { SucursalProducto } from '../sucursal-producto';
import { SucursalProductoEditComponent } from '../sucursal-producto-edit/sucursal-producto-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-sucursal-producto',
   standalone: false,
   templateUrl: 'sucursal-producto-list.component.html',
   styles: [
      'table { min-width: 600px }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class SucursalProductoListComponent implements OnInit {
   displayedColumns = [ 'supSucId',  'supProId',  'supLprId',  'actions'];
   filter = new SucursalProductoFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private sucursalProductoService: SucursalProductoService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.sucursalProductoService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.supSucId='0';
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get sucursalProductoList(): SucursalProducto [] {
      return this.sucursalProductoService.sucursalProductoList;
   }

   
   /* Métodos */

   add() {
      let newSucursalProducto: SucursalProducto = new SucursalProducto();

      this.edit(newSucursalProducto);
   }



   delete (sucursalProducto: SucursalProducto): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el producto por sucursal?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.sucursalProductoService.delete(sucursalProducto).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El producto por sucursal ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.sucursalProductoService.setIsUpdated(true);
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


   edit(ele: SucursalProducto) {
      this.dialog.open(SucursalProductoEditComponent, {
         data: {sucursalProducto:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.sucursalProductoService.load(this.filter);
   }
   
}
