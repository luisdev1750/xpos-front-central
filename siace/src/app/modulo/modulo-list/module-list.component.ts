import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

import { ModuloFilter } from '../modulo-filter';
import { ModuloService } from '../modulo.service';
import { Modulo } from '../modulo';
import { ModuloEditComponent } from '../modulo-edit/modulo-edit.component';

@Component({
   selector: 'app-modulo',
   templateUrl: 'modulo-list.component.html',
   styles: [
      // todo: figure out how to make width dynamic
      'table { min-width: 600px }',
   ]
})
export class ModuloListComponent implements OnInit, OnDestroy {
   displayedColumns = ['modId', 'modModId', 'modNombre', 'modUrl', 'modIcono', 'actions'];
   filter = new ModuloFilter();
   selectedModulo!: Modulo;

   private subs!: Subscription;

   /* Inicialización */

   constructor(private moduloService: ModuloService,
      private toastr: ToastrService,
      public dialog: MatDialog) {
   }


   ngOnInit() {
      this.subs = this.moduloService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.modId = '';

      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get moduloList(): Modulo[] {
      return this.moduloService.moduloList;
   }


   /* Métodos */

   add() {
      let newModulo: Modulo = new Modulo();

      newModulo.modId = Number(this.filter.modId);

      //newModulo.modModId = Number(this.filter.modModId);

      this.edit(newModulo);
   }


   delete(modulo: Modulo): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el módulo?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.moduloService.delete(modulo).subscribe((result) => {
               if (Number(result) > 0) {
                  this.toastr.success('El modulo ha sido guardado exitosamente', 'Transacción exitosa');
                  this.moduloService.setIsUpdated(true);
               }
               else this.toastr.error('Ha ocurrido un error', 'Error');
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }


   edit(ele: Modulo) {
      this.dialog.open(ModuloEditComponent, {
         data: JSON.parse(JSON.stringify(ele)),
         height: '400px',
         width: '600px',
         disableClose : true
      });
   }


   search(): void {
      this.moduloService.load(this.filter);
   }


   select(selected: Modulo): void {
      this.selectedModulo = selected;
   }

}
