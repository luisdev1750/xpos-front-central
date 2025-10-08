import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MarcaFilter } from '../marca-filter';
import { MarcaService } from '../marca.service';
import { Marca } from '../marca';
import { MarcaEditComponent } from '../marca-edit/marca-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-marca',
   standalone: false,
   templateUrl: 'marca-list.component.html',
   styles: [
      'table { min-width: 600px }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class MarcaListComponent implements OnInit {
   displayedColumns = [  'marNombre',  'marActivo',  'actions'];
   filter = new MarcaFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private marcaService: MarcaService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.marcaService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.marId='0';
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get marcaList(): Marca [] {
      return this.marcaService.marcaList;
   }

   
   /* Métodos */

   add() {
      let newMarca: Marca = new Marca();

      this.edit(newMarca);
   }

   onActivoChange(): void {
      this.search();
   }

   delete (marca: Marca): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el marca?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.marcaService.delete(marca).subscribe({
               next: (result) => {
                  if (result?.marId !== undefined && result?.marId !== null && Number(result.marId) >= 0) {
                     this.toastr.success('El marca ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.marcaService.setIsUpdated(true);
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


   edit(ele: Marca) {
      this.dialog.open(MarcaEditComponent, {
         data: {marca:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.marcaService.load(this.filter);
   }
   
}
