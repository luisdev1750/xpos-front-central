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
import { TipoAspecto } from '../tipo-aspecto';
import {
  TipoAspectoEditComponent,
} from '../tipo-aspecto-edit/tipo-aspecto-edit.component';
import { TipoAspectoFilter } from '../tipo-aspecto-filter';
import { TipoAspectoService } from '../tipo-aspecto.service';


@Component({
  selector: 'app-tipo-aspecto',
  templateUrl: 'tipo-aspecto-list.component.html',
  styleUrls: ['tipo-aspecto-list.component.css'],
})
export class TipoAspectoListComponent implements OnInit, OnDestroy {
   displayedColumns = ['tiaId','tiaNombre','actions'];
   filter = new TipoAspectoFilter();
   selectedTipoAspecto!: TipoAspecto;

   private subs!: Subscription;

   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator; 
  }
   /* Inicialización */
  
   constructor(private tipoAspectoService: TipoAspectoService, 
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
      this.subs = this.tipoAspectoService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.tiaId='';
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get tipoAspectoList(): TipoAspecto[] {
      return this.tipoAspectoService.tipoAspectoList;
   }
  
  
  /* Métodos */

   add() {
      let newTipoAspecto: TipoAspecto = new TipoAspecto();
	  
      newTipoAspecto.tiaId = Number(this.filter.tiaId);
	  
      this.edit(newTipoAspecto);
   }


   delete(tipoAspecto: TipoAspecto): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el tipoAspecto? ',
         },
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.tipoAspectoService.delete(tipoAspecto).subscribe(() => {
               this.toastr.success('El tipo de aspecto fue eliminado exitosamente', 'Transacción exitosa');
               this.tipoAspectoService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: TipoAspecto) {
      this.dialog.open(TipoAspectoEditComponent, {
         data: ele
      },
   );
   }   


   search(): void {
      this.tipoAspectoService.load().subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar tipos de aspecto', err);
         }
      );
   }
   

   select(selected: TipoAspecto): void {
      this.selectedTipoAspecto = selected;
   }
  
}
