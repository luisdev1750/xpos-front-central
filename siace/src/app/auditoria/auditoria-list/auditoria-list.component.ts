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
import {
  endOfToday,
  startOfMonth,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import {
  ConfirmacionComponent,
} from '../../encuestas/confirmacion/confirmacion.component';
import { UsuarioService } from '../../usuario/usuario.service';
import { Auditoria } from '../auditoria';
import {
  AuditoriaEditComponent,
} from '../auditoria-edit/auditoria-edit.component';
import {
  AuditoriaFilter,
  UsuarioSiace,
} from '../auditoria-filter';
import { AuditoriaService } from '../auditoria.service';


@Component({
  selector: 'app-auditoria',
  templateUrl: 'auditoria-list.component.html',
  styleUrls: ['auditoria-list.component.css'],
})
export class AuditoriaListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'audId',
    'audModulo',
    'audFecha',
    'audUsrId',
    'audTipo',
    'audJsonOriginal',
    'audJsonModificado',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filter = new AuditoriaFilter();
  selectedAuditoria!: Auditoria;
  fechaIni!: Date;
  fechaFin!: Date;
  private subs!: Subscription;

  /* Inicialización */
  // Opciones para el combobox
  options: string[] = [
    'CARGAS_ENCUESTAS',
    'DIAGNOSTICOS',
    'EMPRENDEDORES',
    'EMPRENDEDORES_ETA',
    'GIROS',
    'NECESIDADES',
    'NIVELES',
    'NIVELES_ESTUDIOS',
    'PERMISOS',
    'RESPUESTAS_A3',
    'ROLES',
    'SESIONES_OBJETIVOS',
    'TIPOS_ASPECTOS',
    'TIPOS_SESIONES',
    'VERSIONES_A3',
    'TODOS',
  ];

  tipos: string[] = ['DELETE', 'INSERT', 'TODOS', 'UPDATE'];
  dataSource = new MatTableDataSource<any>();

  usuarios: UsuarioSiace[] = [];
  // Variable para almacenar la opción seleccionada
  selectedOption: string = 'TODOS';
  constructor(
    private auditoriaService: AuditoriaService,
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
    this.subs = this.auditoriaService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.dataSource.paginator = this.paginator;
    this.filter.audUsrId = 1;

    this.filter.audTipo = 'TODOS';
    this.filter.audModulo = 'TODOS';

    this.filter.audFechaInicial = startOfMonth(new Date());
    this.filter.audFechaFinal = endOfToday();



    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get auditoriaList(): Auditoria[] {
    return this.auditoriaService.auditoriaList;
  }

  /* Métodos */

  add() {
    let newAuditoria: Auditoria = new Auditoria();

    newAuditoria.audUsrId = Number(this.filter.audUsrId);

    // newAuditoria.audTipo = Number(this.filter.audTipo);

    this.edit(newAuditoria);
  }

  delete(auditoria: Auditoria): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el auditoria?: ',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.auditoriaService.delete(auditoria).subscribe(
          () => {
            this.toastr.success(
              'El auditoria ha sido guardado exitosamente',
              'Transacción exitosa'
            );
            this.auditoriaService.setIsUpdated(true);
          },
          (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
      }
    });
  }

  edit(ele: Auditoria) {
    this.dialog.open(AuditoriaEditComponent, {
      data: ele,
      height: '400px',
      width: '600px',
    });
  }

  onSelectionChange(
    event: any,
    field: 'audModulo' | 'audTipo' | 'audUsrId'
  ): void {
    // Realizamos casting explícito en la asignación para evitar el error
    (this.filter as any)[field] = event.value;


    // Llama a la función de búsqueda o cualquier otra lógica necesaria
    this.search();
  }
  search(): void {
    this.auditoriaService.load(this.filter).subscribe(
      data => {

        this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
        this.dataSource.paginator = this.paginator;
      },
      err => {
        console.error('Error al cargar auditorías', err);
      }
    );

  }

  select(selected: Auditoria): void {
    this.selectedAuditoria = selected;
  }


  // Método para comparar dos JSON y devolver solo las diferencias
  compareJson(
    original: any,
    modificado: any
  ): { original: any; modificado: any } {
    let diffOriginal: any = {};
    let diffModificado: any = {};

    // Recorrer las propiedades del JSON original
    for (const key in original) {
      if (original.hasOwnProperty(key)) {
        if (modificado[key] !== original[key]) {
          // Si el campo es diferente, lo añadimos a los objetos de diferencias
          diffOriginal[key] = original[key];
          diffModificado[key] = modificado[key];
        }
      }
    }

    return { original: diffOriginal, modificado: diffModificado };
  }


  formatJsonString(jsonString: string): string {
    try {
      // Parsear el string JSON
      const parsed = JSON.parse(jsonString);


      let arreglo = parsed.split(', ');

      let htmlResultado: string = this.generarHTML(arreglo);

      return htmlResultado;

      // Convertirlo de nuevo a string con formato legible
      let formatted = JSON.stringify(parsed, null, 2)
        .replace(/ /g, '&nbsp;')
        //.replace(/,/g, '<br/>') // Reemplaza comas por saltos de línea
        .replace(/\n/g, '<br/>'); // Asegúrate de que los saltos de línea se mantengan

      // Quitar comillas
      formatted = formatted.replace(/"/g, '');

      return formatted;
    } catch (e) {
      // Si no es un JSON válido, devolver el mensaje tal como está
      return jsonString;
    }
  }
  generarHTML(arreglo: string[]): string {
    let resultado: string = '';

    arreglo.forEach((item, index) => {
      const [clave, valor] = item.split(': '); // Separar clave y valor
      const div: string = `
            <div class="container">
    <div class="row">
        <div class="col-12 col-md-6 ml-auto">
            <p class="grid-key"><strong>${clave}&nbsp;:</strong> </p>
        </div>
        <div class="col-12 col-md-6">
            <p class="grid-value">${valor}</p>
        </div>
    </div>
</div>
        `;

      // Añadir <br/> para todos menos el primero
      resultado += div + '<br/>';
    });

    return resultado;
  }

  getJsonDiff(
    original: string,
    modificado: string
  ): { original: string; modificado: string } {
    let jsonOriginal, jsonModificado;

    // Función para validar si un string es JSON o está vacío
    const isValidJson = (str: string): boolean => {
      if (!str || str.trim() === '') {
        return false; // Si el string está vacío o solo tiene espacios en blanco
      }
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    };

    // Manejo de JSON original
    try {
      if (isValidJson(original)) {
        jsonOriginal = JSON.parse(original);
      } else {
        jsonOriginal = {}; // Si está vacío, usamos un objeto vacío
      }
    } catch (e) {
      console.error(
        'Error al parsear JSON original:',
        e,
        'Contenido del JSON original:',
        original
      );
      jsonOriginal = {}; // En caso de error, usamos un objeto vacío
    }

    // Manejo de JSON modificado
    try {
      if (isValidJson(modificado)) {
        jsonModificado = JSON.parse(modificado);
      } else {
        jsonModificado = {}; // Si está vacío, usamos un objeto vacío
      }
    } catch (e) {
      console.error(
        'Error al parsear JSON modificado:',
        e,
        'Contenido del JSON modificado:',
        modificado
      );
      jsonModificado = {}; // En caso de error, usamos un objeto vacío
    }

    const diffOriginal: { [key: string]: any } = {};
    const diffModificado: { [key: string]: any } = {};

    // Comparar los JSONs y solo guardar las diferencias
    for (const key in jsonOriginal) {
      if (jsonOriginal.hasOwnProperty(key)) {
        if (jsonOriginal[key] !== jsonModificado[key]) {
          diffOriginal[key] = jsonOriginal[key];
          diffModificado[key] = jsonModificado[key];
        }
      }
    }

    // Función para remover corchetes y comillas
    const formatObject = (obj: { [key: string]: any }) => {
      return Object.keys(obj)
        .map((key) => `${key}: ${obj[key]}`) // Formatear como 'key: value'
        .join(', '); // Unir las entradas con comas
    };

    // Si jsonOriginal está vacío, usar jsonModificado
    if (Object.keys(diffOriginal).length === 0) {
      return {
        original: '', // O un mensaje indicando que no hay original
        modificado: formatObject(jsonModificado),
      };
    }

    return {
      original: formatObject(diffOriginal),
      modificado: formatObject(diffModificado),
    };
  }

  showDetails(message: any, tipoHistorial: string) {
    const formattedMessage = this.formatJsonString(JSON.stringify(message));


    const confirmaDialog = this.dialog.open(ConfirmacionComponent, {
      data: {
        titulo: tipoHistorial,
        mensaje: formattedMessage,
        showConfirmButton: false,
      },
      width: '600px',
      minWidth: '400px',
      maxWidth: '1000px',
    });

    confirmaDialog.afterClosed().subscribe((result) => {
    });
  }
}
