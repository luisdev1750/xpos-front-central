import {
   Component,
   Input,
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
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
   ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import {
   FormatoApoyoListComponent,
} from '../../formato-apoyo/formato-apoyo-list/formato-apoyo-list.component';
import { ApplicationUser } from '../../login/login.service';
import { Apoyo } from '../apoyo';
import { ApoyoEditComponent } from '../apoyo-edit/apoyo-edit.component';
import { ApoyoFilter } from '../apoyo-filter';
import { ApoyoService } from '../apoyo.service';
import { GeneralComponent } from '../../common/general-component';
import { LocationStrategy } from '@angular/common';


@Component({
   selector: 'app-apoyo',
   templateUrl: 'apoyo-list.component.html',
   styleUrls: ['apoyo-list.component.css'],
})
export class ApoyoListComponent extends GeneralComponent implements OnInit, OnDestroy {
   displayedColumns = ['apoId', 'apoTitulo', 'apoDescripcion', 'apoTutorial', 'apoLiga', 'actions'];//'apoTutorialDoc',
   filter = new ApoyoFilter();
   selectedApoyo!: Apoyo;

   dataSource = new MatTableDataSource<any>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;

   private subs!: Subscription;
   @Input('aaaId') aaaId!: number;
   @Input('veaFechaActivacion') veaFechaActivacion!: DateTime;
   @Input('empId') empId!: number;

   override user!: ApplicationUser;
   logEmpId!: number;
   logEmpNombre!: string;
   logRoleId!: string;

   /* Inicialización */

   constructor(private apoyoService: ApoyoService,
      private toastr: ToastrService,
      public dialog: MatDialog,
      private paginatoor: MatPaginatorIntl,
      protected override locationStrategy: LocationStrategy,
   ) {
      super(locationStrategy);
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


   ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
   }


   ngOnInit() {
      this.subs = this.apoyoService.getIsUpdated().subscribe(() => {
         this.search();
      });

      this.search();
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Accesors */

   get apoyoList(): Apoyo[] {
      return this.apoyoService.apoyoList;
   }


   /* Métodos */

   add() {
      let newApoyo: Apoyo = new Apoyo();
      newApoyo.apoAaaId = this.aaaId;
      this.edit(newApoyo);
   }


   delete(apoyo: Apoyo): void {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
         data: {
            title: 'Confirmación',
            message: '¿Está seguro de eliminar el apoyo?: '
         }
      });
      confirmDialog.afterClosed().subscribe(result => {
         if (result === true) {

            this.apoyoService.delete(apoyo).subscribe(() => {
               this.toastr.success('El apoyo ha sido eliminado exitosamente', 'Transacción exitosa');
               this.apoyoService.setIsUpdated(true);
            },
               err => {
                  this.toastr.error('Ha ocurrido un error', 'Error');
               }
            );
         }
      });
   }


   edit(ele: Apoyo) {
      this.dialog.open(ApoyoEditComponent, {
         //data: ele, 
         data: { apoyo: ele, veaFechaActivacion: this.veaFechaActivacion },
         height: '80vh',
         minWidth: '55vw',
      });
   }


   getFileName(filePath: string): string {
      return filePath.split('/').pop() || filePath;
   }


   search(): void {
      this.filter.apoAaaId = this.aaaId.toString();
      this.apoyoService.load(this.filter);
      this.apoyoService.loadApoyo(this.filter).subscribe(
         data => {
            this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
            this.dataSource.paginator = this.paginator; // Asignamos el paginador
         },
         err => {
            console.error('Error al cargar apoyos', err);
         }
      );
   }


   select(selected: Apoyo): void {
      this.selectedApoyo = selected;
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

   openFormatoApoyoDialog(apoId: number, empId: number): void {
      const dialogRef = this.dialog.open(FormatoApoyoListComponent, {
         minWidth: '500px',
         data: { apoId, empId }, // Pasamos el apoId como datos
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log('El modal se cerró');
         // Aquí puedes manejar lo que necesites después de que se cierre el modal
      });
   }

}
