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
import { NivelEstudio } from '../nivel-estudio';
import {
  NivelEstudioEditComponent,
} from '../nivel-estudio-edit/nivel-estudio-edit.component';
import { NivelEstudioFilter } from '../nivel-estudio-filter';
import { NivelEstudioService } from '../nivel-estudio.service';


@Component({
  selector: 'app-nivel-estudio',
  templateUrl: 'nivel-estudio-list.component.html',
  styleUrls: ['nivel-estudio-list.component.css'],
})
export class NivelEstudioListComponent implements OnInit, OnDestroy {
   displayedColumns = ['nieId','nieDescripcion','actions'];
   filter = new NivelEstudioFilter();
   selectedNivelEstudio!: NivelEstudio;

   private subs!: Subscription;
   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator; 
  }
   /* Inicialización */
  
   constructor(private nivelEstudioService: NivelEstudioService, 
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
      this.subs = this.nivelEstudioService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.nieId='';
	  
      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */
   
   get nivelEstudioList(): NivelEstudio[] {
      return this.nivelEstudioService.nivelEstudioList;
   }
  
  
  /* Métodos */

   add() {
      let newNivelEstudio: NivelEstudio = new NivelEstudio();
	  
      newNivelEstudio.nieId = Number(this.filter.nieId);
	  
      this.edit(newNivelEstudio);
   }


   delete(nivelEstudio: NivelEstudio): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el nivelEstudio? '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.nivelEstudioService.delete(nivelEstudio).subscribe(() => {
               this.toastr.success('El Nivel de Estudio ha sido eliminado exitosamente', 'Transacción exitosa');
               this.nivelEstudioService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: NivelEstudio) {
      this.dialog.open(NivelEstudioEditComponent, {
         data: ele,
      });
   }   


   search(): void {
      this.nivelEstudioService.load(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar niveles de estudio', err);
         }
      );
   }
   

   select(selected: NivelEstudio): void {
      this.selectedNivelEstudio = selected;
   }
  
}
