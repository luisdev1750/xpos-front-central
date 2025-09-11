import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Objetivo } from '../objetivo';
import {
  ObjetivoEditComponent,
} from '../objetivo-edit/objetivo-edit.component';
import { ObjetivoFilter } from '../objetivo-filter';
import { ObjetivoService } from '../objetivo.service';


@Component({
  selector: 'app-objetivo',
  templateUrl: 'objetivo-list.component.html',
  styleUrls: ['objetivo-list.component.css'],
})
export class ObjetivoListComponent implements OnInit, OnDestroy {
   displayedColumns = ['objId','objNombre','objDescripcion','objFormato','actions'];
   filter = new ObjetivoFilter();
   selectedObjetivo!: Objetivo;

   private subs!: Subscription;
   @Input('tisId') tisId!:number;


   /* Inicialización */
  
   constructor(private objetivoService: ObjetivoService, 
      private toastr: ToastrService,
      public dialog: MatDialog) {
   }


   ngOnInit() {
      this.subs = this.objetivoService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get objetivoList(): Objetivo[] {
      return this.objetivoService.objetivoList;
   }
  
  
  /* Métodos */

   add() {
      let newObjetivo: Objetivo = new Objetivo();
      newObjetivo.objTisId = this.tisId;
      this.edit(newObjetivo);
   }


   delete(objetivo: Objetivo): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el objetivo?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.objetivoService.delete(objetivo).subscribe(() => {
               this.toastr.success('El objetivo ha sido guardado exitosamente', 'Transacción exitosa');
               this.objetivoService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Objetivo) {
      this.dialog.open(ObjetivoEditComponent, {
         data: ele,
         width: '600px',
      });
   }   


   search(): void {
      this.filter.objTisId=this.tisId.toString();
      this.objetivoService.load(this.filter);
   }


   select(selected: Objetivo): void {
      this.selectedObjetivo = selected;
   }
  
}
