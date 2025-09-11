import {
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableMatDialogData } from '../../../../../dto/dtoBusiness';


export interface EmpresaData {
  emprendedor_ID: number;
  empRazonSocial?: string; // Puede ser undefined
  etaDescripcion?: string; // Puede ser undefined
  conPromedio?: number;    // Puede ser undefined
  sesFechas: (string | null)[]; // Arreglo con fechas o null
  porcentajeCompletado: number;
  nivel_Descripcion: string;
}

@Component({
  selector: 'app-table-mat-dialog',
  templateUrl: './table-mat-dialog.component.html',
  styleUrls: ['./table-mat-dialog.component.css']
})
export class TableMatDialogComponent {

  
  displayedColumns: string[] = [
    'emprendedor_ID', 'empRazonSocial', 'etaDescripcion', 'conPromedio',
    //'sesion0', 'sesion1', 'sesion2', 'sesion3', 'sesion4', 'sesion5', 'sesion6', 'sesion7', 'sesion8',
    //'porcentajeCompletado', 'nivel_Descripcion'
  ];

  sesionesNombre: string[] = []


  columnHeaders: { [key: string]: string } = {
    emprendedor_ID: 'ID Emprendedor',
    empRazonSocial: 'Razón Social',
    etaDescripcion: 'Etapa',
    conPromedio: 'Promedio',
    /*sesion0: 'Entrevista',
    sesion1: 'Sesión 1',
    sesion2: 'Sesión 2',
    sesion3: 'Sesión 3',
    sesion4: 'Sesión 5',
    sesion5: 'Sesión 6',
    sesion6: 'Sesión 7',
    sesion7: 'Sesión 8',
    sesion8: 'Sesión 9',*/
    porcentajeCompletado: '% de Actividades Completadas',
    nivel_Descripcion: 'Nivel'
  };

  //dataSource = this.data.content;

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, subtitle: string, content: TableMatDialogData[],headers: string[] },
    private paginatoor: MatPaginatorIntl,
  ) {
    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';


    for (let i = 0; i < this.data.headers.length; i++) {
      this.displayedColumns.push(`sesion${i}`);
      this.columnHeaders[`sesion${i}`] = this.data.headers[i];
    }

    //this.displayedColumns.push(...this.data.headers);
    this.displayedColumns.push('porcentajeCompletado', 'nivel_Descripcion');


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

    console.log('evento', data.title);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.dataSource.data = this.data.content; // Asignamos los datos al MatTableDataSource
    this.dataSource.paginator = this.paginator; // Asignamos el paginador
  }
}
