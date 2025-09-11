import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PresentacionFilter } from '../presentacion-filter';
import { PresentacionService } from '../presentacion.service';
import { Presentacion } from '../presentacion';
import { PresentacionEditComponent } from '../presentacion-edit/presentacion-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-presentacion',
   standalone: false,
   templateUrl: 'presentacion-list.component.html',
   styles: [
      'table { }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class PresentacionListComponent implements OnInit {
   displayedColumns = [ 'preId',  'preNombre',  'preActivo',  'actions'];
   filter = new PresentacionFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private presentacionService: PresentacionService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.presentacionService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.preId='0';
      this.filter.preActivo = 'all'
   }

   onActivoChange(): void {
      this.search();
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get presentacionList(): Presentacion [] {
      return this.presentacionService.presentacionList;
   }

   
   /* Métodos */

   add() {
      let newPresentacion: Presentacion = new Presentacion();

      this.edit(newPresentacion);
   }



   delete (presentacion: Presentacion): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el presentacion?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.presentacionService.delete(presentacion).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El presentacion ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.presentacionService.setIsUpdated(true);
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


   edit(ele: Presentacion) {
      this.dialog.open(PresentacionEditComponent, {
         data: {presentacion:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.presentacionService.load(this.filter);
   }
   
}
