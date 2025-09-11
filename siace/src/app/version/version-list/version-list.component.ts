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
import { Version } from '../version';
import { VersionEditComponent } from '../version-edit/version-edit.component';
import { VersionFilter } from '../version-filter';
import { VersionService } from '../version.service';


@Component({
  selector: 'app-version',
  templateUrl: 'version-list.component.html',
  styleUrls: ['version-list.component.css']
})
export class VersionListComponent implements OnInit, OnDestroy {
   displayedColumns = ['veaId','veaFecha','veaNoVersion', 'usuario', 'veaActivo','actions'];
   filter = new VersionFilter();
   selectedVersion!: Version;

   private subs!: Subscription;

   /* Inicialización */
   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
   
   constructor(private versionService: VersionService, 
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


   ngAfterViewInit(): void{
      this.dataSource.paginator = this.paginator; 
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   ngOnInit() {
      this.subs = this.versionService.getIsUpdated().subscribe(() => {
         this.search();
      });
	  
	  this.filter.veaId='';
	  
      this.search();
   }


   /* Accesors */
   get versionList(): Version[] {
      return this.versionService.versionList;
   }
  
  
  /* Métodos */
   add() {
      let newVersion: Version = new Version();
	  
      newVersion.veaId = Number(this.filter.veaId);
      newVersion.veaActivo=true;
	  
      this.edit(newVersion);
   }


   clonar(version: Version): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de clonar esta version version?: '
         },
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.versionService.clone(version).subscribe(() => {
               this.toastr.success('El version ha sido clonada exitosamente', 'Transacción exitosa');
               this.versionService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }

   
   delete(version: Version): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar la version?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.versionService.delete(version).subscribe(() => {
               this.toastr.success('El version ha sido eliminada exitosamente', 'Transacción exitosa');
               this.versionService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }
  

   edit(ele: Version) {
      this.dialog.open(VersionEditComponent, {
         data: ele,
         minWidth: '80vw',
         height: '80vh',
      });
   }   


   search(): void {
      this.versionService.load(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar versiones', err);
         }
      );
   }


   select(selected: Version): void {
      this.selectedVersion = selected;
   }
}
