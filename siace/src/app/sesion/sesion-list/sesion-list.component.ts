import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

import { SesionFilter } from '../sesion-filter';
import { SesionService } from '../sesion.service';
import { Sesion } from '../sesion';
import { SesionEditComponent } from '../sesion-edit/sesion-edit.component';

@Component({
  selector: 'app-sesion',
  templateUrl: 'sesion-list.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'table { min-width: 100%; }',
   '.mat-column-actions {flex: 0 0 15%;}'
  ]
})
export class SesionListComponent implements OnInit, OnDestroy {
   displayedColumns = ['sesId','sesTisId','sesHoraIni','sesHoraFin','sesEmpId','sesUsrId','sesFecha','actions'];
   filter = new SesionFilter();
   selectedSesion!: Sesion;

   private subs!: Subscription;

   /* Inicialización */
  
   constructor(private sesionService: SesionService, 
      private toastr: ToastrService,
      public dialog: MatDialog) {
   }


   ngOnInit() {
      this.subs = this.sesionService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.sesId='';
	  
	  this.filter.sesTisId='';
	  
	  this.filter.sesEmpId='';
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get sesionList(): Sesion[] {
      return this.sesionService.sesionList;
   }
  
  
  /* Métodos */

   add() {
      let newSesion: Sesion = new Sesion();
	  
      newSesion.sesId = Number(this.filter.sesId);
	  
      newSesion.sesTisId = Number(this.filter.sesTisId);
	  
      newSesion.sesEmpId = Number(this.filter.sesEmpId);
	  
      this.edit(newSesion);
   }


   delete(sesion: Sesion): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el sesion?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.sesionService.delete(sesion).subscribe(() => {
               this.toastr.success('El sesion ha sido eliminada exitosamente', 'Transacción exitosa');
               this.sesionService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Sesion) {
      this.dialog.open(SesionEditComponent, {
         data: ele,
         height: '400px',
         width: '800px',
         disableClose: true
      });
   }   


   search(): void {
      this.sesionService.load(this.filter);
   }


   select(selected: Sesion): void {
      this.selectedSesion = selected;
   }
  
}
