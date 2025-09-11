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
import { Pilar } from '../pilar';
import { PilarEditComponent } from '../pilar-edit/pilar-edit.component';
import { PilarFilter } from '../pilar-filter';
import { PilarService } from '../pilar.service';


@Component({
  selector: 'app-pilar',
  templateUrl: 'pilar-list.component.html',
  styleUrls: [ 'pilar-list.component.css']
})
export class PilarListComponent implements OnInit, OnDestroy {
   displayedColumns = ['pilId','pilDescripcion','pilPondMax','pilPondMin','actions'];
   filter = new PilarFilter();
   selectedPilar!: Pilar;

   private subs!: Subscription;
   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator; 
  }
   /* Inicialización */
  
   constructor(private pilarService: PilarService, 
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
      this.subs = this.pilarService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.pilId='';
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get pilarList(): Pilar[] {
      return this.pilarService.pilarList;
   }
  
  
  /* Métodos */

   add() {
      let newPilar: Pilar = new Pilar();
	  
      newPilar.pilId = Number(this.filter.pilId);
	  
      this.edit(newPilar);
   }


   delete(pilar: Pilar): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el pilar? '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.pilarService.delete(pilar).subscribe(() => {
               this.toastr.success('El pilar ha sido eliminado exitosamente', 'Transacción exitosa');
               this.pilarService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Pilar) {
      this.dialog.open(PilarEditComponent, {
         data: ele,
         minWidth: '50vw'
      });
   }   


   search(): void {
      this.pilarService.load().subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar pilares', err);
         }
      );
   }
   

   select(selected: Pilar): void {
      this.selectedPilar = selected;
   }
  
}
