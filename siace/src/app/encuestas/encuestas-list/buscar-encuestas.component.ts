import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  endOfToday,
  startOfMonth,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { EncuestaListService } from './buscar-encuestas.service';
import { LocationStrategy } from '@angular/common';
import { GeneralComponent } from '../../common/general-component';


@Component({
  selector: 'app-encuestas-list',
  templateUrl: './buscar-encuestas.component.html',
  styleUrls: ['./buscar-encuestas.component.css'],
})
export class EncuestasListComponent extends GeneralComponent {
  selectedStatus!: string;
  fechaIni!: Date;
  fechaFin!: Date;

  displayedColumns: string[] = [
    'caeId',
    'caeArchivo',
    'caeFecha',
    'caeEstatus',
    'caeNumeroPreguntas',
    'caeEncActivo',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultados: any[] = []; // Variable para almacenar los resultados

  /* Constructores */
  constructor(
    private encuestaListService: EncuestaListService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private http: HttpClient,
    private paginatoor: MatPaginatorIntl,
    protected override locationStrategy: LocationStrategy
  ) {
    super(locationStrategy);
    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';
  }
  ngOnInit() {
    this.selectedStatus = '0';
    this.fechaIni = startOfMonth(new Date());
    this.fechaFin = endOfToday();
    this.sendInfo();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /* Métodos */

  downloadFile(formato: string): void {
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

  formatDate(dateString: string): string {
    const date = new Date(
      dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')
    );

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const datePart = date.toLocaleDateString('es-ES', dateOptions);
    const timePart = date.toLocaleTimeString('es-ES', timeOptions);

    return `${datePart} ${timePart}`;
  }


  getFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }


  newDocument() {
    console.log('Abrir nuevo dialogo');

    const dialogRef = this.dialog.open(UploadFileComponent, {
      ///CLonar el dato original, copiarlo y no permitir que se modifique
      data: JSON.parse(JSON.stringify('')),
      minWidth: '450px',
      width: '500px',
      ////Al tocar fuera de la pantalla, no permitir cerrar
      // disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.sendInfo();
      if (result) {
        // Actualizar el elemento modificado en el arreglo principal
        console.log('Regresa el elemento modificado');
        console.log(result);
        this.sendInfo();
      }
    });
  }

  sendInfo() {
    if (this.fechaIni == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una fecha inicial',
        'Precaución'
      );
      return;
    } else if (this.fechaFin == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una fecha final',
        'Precaución'
      );
      return;
    }

    this.encuestaListService
      .searchPreguntas(
        this.fechaIni.toJSON(),
        this.fechaFin.toJSON(),
        this.selectedStatus
      )
      .subscribe({
        next: (res) => {
          console.log('RESPUESTA');
          console.log(res);
          this.resultados = res; // Asignar la respuesta a la variable de resultados
          this.dataSource.data = this.resultados.reverse();
        },
        error: (error) => {
          console.log('Error');
          console.log(error);
        },
      });
  }
}
