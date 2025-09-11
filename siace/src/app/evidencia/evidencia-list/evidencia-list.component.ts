import {
   Component,
   Input,
   OnDestroy,
   OnInit,
   ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
   ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Evidencia } from '../evidencia';
import {
   EvidenciaEditComponent,
} from '../evidencia-edit/evidencia-edit.component';
import { EvidenciaFilter } from '../evidencia-filter';
import { EvidenciaService } from '../evidencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';


@Component({
   selector: 'app-evidencia',
   templateUrl: 'evidencia-list.component.html',
   styleUrls: ['evidencia-list.component.css']
})
export class EvidenciaListComponent implements OnInit, OnDestroy {
   displayedColumns = ['eviId', 'eviDescripcion', 'actions'];
   filter = new EvidenciaFilter();
   selectedEvidencia!: Evidencia;

   private subs!: Subscription;
   @Input('aaaId') aaaId!: number;
   @Input('veaFechaActivacion') veaFechaActivacion!: DateTime;

   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
   /* Inicialización */

   constructor(private evidenciaService: EvidenciaService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private paginatoor: MatPaginatorIntl,
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


   ngOnInit() {
      this.subs = this.evidenciaService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get evidenciaList(): Evidencia[] {
      return this.evidenciaService.evidenciaList;
   }


   /* Métodos */

   add() {
      let newEvidencia: Evidencia = new Evidencia();

      newEvidencia.eviId = Number(this.filter.eviId);

      newEvidencia.eviAaaId = Number(this.filter.eviAaaId);

      this.edit(newEvidencia);
   }


   delete(evidencia: Evidencia): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar la evidencia?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.evidenciaService.delete(evidencia).subscribe(() => {
               this.toastr.success('La evidencia ha sido guardado exitosamente', 'Transacción exitosa');
               this.evidenciaService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }


   edit(ele: Evidencia) {
      this.dialog.open(EvidenciaEditComponent, {
         data: { evidencia: JSON.parse(JSON.stringify(ele)), veaFechaActivacion: this.veaFechaActivacion },
      },
      );
   }


   search(): void {
      this.filter.eviAaaId = this.aaaId.toString();
      this.evidenciaService.load(this.filter);

      this.evidenciaService.loadEvidencia(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar evidencias', err);
         }
      );
   }


   select(selected: Evidencia): void {
      this.selectedEvidencia = selected;
   }

}
