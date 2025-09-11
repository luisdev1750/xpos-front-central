import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PerfilFilter } from '../perfil-filter';
import { PerfilService } from '../perfil.service';
import { Perfil } from '../perfil';
import { PerfilEditComponent } from '../perfil-edit/perfil-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-perfil',
   standalone: false,
   templateUrl: 'perfil-list.component.html',
   styles: [
      'table {}',
      '.mat-column-actions {flex: 0 0 10%;}'
   ]
})
export class PerfilListComponent implements OnInit {
   displayedColumns = [ 'perId',  'perNombre',  'perClave',  'perActivo',  'actions'];
   filter = new PerfilFilter();

   private subs!: Subscription;

   
    /* Inicialización */

   constructor(
      private perfilService: PerfilService,
      private toastr: ToastrService,
      public dialog: MatDialog,) {
      this.subs = this.perfilService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.filter.perId='0';
      this.filter.perActivo = 'all';
      this.filter.perNombre = 'all';
   }


   ngOnInit() {
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get perfilList(): Perfil [] {
      return this.perfilService.perfilList;
   }

   onActivoChange(){
      this.search();
   }
   /* Métodos */

   add() {
      let newPerfil: Perfil = new Perfil();

      this.edit(newPerfil);
   }



   delete (perfil: Perfil): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el perfil?'
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.perfilService.delete(perfil).subscribe({
               next: (result) => {
                  if (Number(result) > 0) {
                     this.toastr.success('El perfil ha sido eliminado exitosamente', 'Transacción exitosa');
                     this.perfilService.setIsUpdated(true);
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


   edit(ele: Perfil) {
      this.dialog.open(PerfilEditComponent, {
         data: {perfil:JSON.parse(JSON.stringify(ele))},
         height: '500px',
         width: '700px',
         maxWidth: 'none',
         disableClose : true
      });
   }


   search(): void {
      this.perfilService.load(this.filter);
   }
   
}
