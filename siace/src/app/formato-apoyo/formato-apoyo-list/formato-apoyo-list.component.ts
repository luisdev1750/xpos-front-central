import {
   Component,
   Inject,
   Input,
   OnDestroy,
   OnInit,
   ViewChild,
} from '@angular/core';
import {
   MAT_DIALOG_DATA,
   MatDialog,
} from '@angular/material/dialog';
import {
   MatPaginator,
   MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
   ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { ApplicationUser } from '../../login/login.service';
import { FormatoApoyo } from '../formato-apoyo';
import {
   FormatoApoyoEditComponent,
} from '../formato-apoyo-edit/formato-apoyo-edit.component';
import { FormatoApoyoFilter } from '../formato-apoyo-filter';
import { FormatoApoyoService } from '../formato-apoyo.service';
import { GeneralComponent } from '../../common/general-component';
import { LocationStrategy } from '@angular/common';


@Component({
   selector: 'app-formato-apoyo',
   templateUrl: 'formato-apoyo-list.component.html',
   styleUrls: ['formato-apoyo-list.component.css'],
})
export class FormatoApoyoListComponent extends GeneralComponent implements OnInit, OnDestroy {
   displayedColumns = ['foaId', 'foaArchivo', 'actions'];
   filter = new FormatoApoyoFilter();
   selectedFormatoApoyo!: FormatoApoyo;

   private subs!: Subscription;

   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;

   @Input('apoId') apoId!: number;
   @Input('veaFechaActivacion') veaFechaActivacion!: DateTime;

   override user!: ApplicationUser;
   logEmpId!: number;
   logEmpNombre!: string;
   logRoleId!: string;

   logApoId!: number;
   empId!: number;
   /* Inicialización */

   constructor(private formatoApoyoService: FormatoApoyoService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private paginatoor: MatPaginatorIntl,
      protected override locationStrategy: LocationStrategy,
      @Inject(MAT_DIALOG_DATA) public data: any
   ) {
      super(locationStrategy);
      this.logApoId = data.apoId;
      this.empId = data.empId;
      this.apoId = this.logApoId;
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
      this.subs = this.formatoApoyoService.getIsUpdated().subscribe(() => {
         this.search();
      });

      //this.filter.foaApoId='';
      this.filter.foaId = '';

      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get formatoApoyoList(): FormatoApoyo[] {
      return this.formatoApoyoService.formatoApoyoList;
   }


   /* Métodos */

   add() {
      let newFormatoApoyo: FormatoApoyo = new FormatoApoyo();

      newFormatoApoyo.foaApoId = this.apoId;

      this.edit(newFormatoApoyo);
   }


   delete(formatoApoyo: FormatoApoyo): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el formato de apoyo?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.formatoApoyoService.delete(formatoApoyo).subscribe(() => {
               this.toastr.success('El formato de apoyo ha sido guardado exitosamente', 'Transacción exitosa');
               this.formatoApoyoService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }


   edit(ele: FormatoApoyo) {
      this.dialog.open(FormatoApoyoEditComponent, {
         data: ele,
      });
   }


   getFileName(filePath: string): string {
      return filePath.split('/').pop() || filePath;
   }


   search(): void {

      this.filter.foaApoId = this.apoId.toString();
      this.formatoApoyoService.load(this.filter);
      this.formatoApoyoService.loadFormato(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar formatos', err);
         }
      );
   }


   select(selected: FormatoApoyo): void {
      this.selectedFormatoApoyo = selected;
   }

   onDownloadClick(formato: string): void {
      // Obtener la fecha actual y restar 6 horas
      const date = new Date();
      date.setHours(date.getHours() - 6); // Resta 6 horas

      // Formatear la fecha como yyyyMMddHHmmss
      let formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 15);
      formattedDate = formattedDate.replace(/\.$/, '');

      // Construir la URL completa
      const url = `${formato}?${this.user.blobToken}`;

      // Descargar el archivo con el nombre personalizado
      fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error("Error al descargar el archivo.");
            }
            return response.blob();
         })
         .then(blob => {
            // Obtener el nombre base del archivo original
            const fileName = formato.split('/').pop() ?? 'archivo';

            // Separar el nombre y la extensión
            const dotIndex = fileName.lastIndexOf('.');
            const baseName = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
            const extension = dotIndex !== -1 ? fileName.substring(dotIndex) : '';

            // Crear un enlace temporal para descargar el archivo
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${baseName}_${formattedDate}${extension}`; // Nombre con la fecha antes de la extensión
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Liberar el objeto URL
            URL.revokeObjectURL(downloadUrl);
         })
         .catch(error => {
            console.error("Error al descargar el archivo:", error);
         });
   }



}
