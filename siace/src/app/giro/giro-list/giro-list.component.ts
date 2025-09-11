import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Giro } from '../giro';
import { GiroEditComponent } from '../giro-edit/giro-edit.component';
import { GiroFilter } from '../giro-filter';
import { GiroService } from '../giro.service';


@Component({
  selector: 'app-giro',
  templateUrl: 'giro-list.component.html',
  styleUrls: ['giro-list.component.css']
})
export class GiroListComponent implements OnInit, OnDestroy {
   displayedColumns = ['girId','girDescripcion','actions'];
   filter = new GiroFilter();
   selectedGiro!: Giro;

   private subs!: Subscription;

   dataSource = new MatTableDataSource<any>();
   @ViewChild(MatPaginator) paginator!: MatPaginator;

   /* Inicialización */
  
   constructor(private giroService: GiroService, 
      private toastr: ToastrService,
      public dialog: MatDialog,
      private paginatoor: MatPaginatorIntl
    ) {
      this.paginatoor.itemsPerPageLabel = 'Elementos por página';
      this.paginatoor.nextPageLabel = 'Siguiente página';
      this.paginatoor.previousPageLabel = 'Página anterior';
      this.paginatoor.firstPageLabel = 'Primera página';
      this.paginatoor.lastPageLabel = 'Última página';
  
  
      this.paginatoor.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
        return `${startIndex + 1} – ${endIndex} de ${length}`;
      };
    

   }


   ngOnInit() {
      this.subs = this.giroService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.girId='';
     this.dataSource.paginator = this.paginator; 
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get giroList(): Giro[] {
      return this.giroService.giroList;
   }
  
  
  /* Métodos */

   add() {
      let newGiro: Giro = new Giro();
	  
      newGiro.girId = Number(this.filter.girId);
	  
      this.edit(newGiro);
   }


   delete(giro: Giro): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el giro? '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.giroService.delete(giro).subscribe(() => {
               this.toastr.success('El giro ha sido eliminado exitosamente', 'Transacción exitosa');
               this.giroService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Giro) {
      this.dialog.open(GiroEditComponent, {
         data: ele
      });
   }   


   search(): void {
      this.giroService.load(this.filter).subscribe(
         data => {
            this.dataSource.data = data; 
            this.dataSource.paginator = this.paginator;
         },
         err => {
            console.error('Error al cargar giros', err);
         }
      );
   }


   select(selected: Giro): void {
      this.selectedGiro = selected;
   }
  
}
