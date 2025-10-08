import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BancoFilter } from '../banco-filter';
import { BancoService } from '../banco.service';
import { Banco } from '../banco';
import { BancoEditComponent } from '../banco-edit/banco-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-banco',
   standalone: false,
   templateUrl: 'banco-list.component.html',
   styles: [
      'table { min-width: 600px }',
      '.mat-column-actions {flex: 0 0 10%;}'
   ],
   
})
export class BancoListComponent implements OnInit {
   displayedColumns = [   'banNombre',  'banActivo',  'actions'];
   filter = new BancoFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private bancoService: BancoService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.bancoService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.banId='0';
      this.filter.banId = '0';
      this.filter.banActivo = ''; 
   }




   toggleActivo(banco: Banco, isChecked: boolean): void {
      // Actualizar el estado local
      banco.banActivo = isChecked;
   }

   ngOnInit() {
      this.search();
   }

    onActivoChange(): void {
      this.search();
   }

   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get bancoList(): Banco [] {
      return this.bancoService.bancoList;
   }

   
   /* Métodos */

   add() {
      let newBanco: Banco = new Banco();

      this.edit(newBanco);
   }



   delete (banco: Banco): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el banco?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.bancoService.delete(banco).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El banco ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.bancoService.setIsUpdated(true);
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


   edit(ele: Banco) {
      this.dialog.open(BancoEditComponent, {
         data: {banco:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.bancoService.load(this.filter);
   }
   
}
