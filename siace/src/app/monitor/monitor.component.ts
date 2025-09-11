import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  endOfDay,
  endOfToday,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { CuestionarioService } from '../cuestionario/cuestionario.service';
import { Pregunta } from '../cuestionario/pregunta';
import { ValorPonderadoPorPilar } from '../cuestionario/valorPonderadoPilar';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import {
  ConfirmacionComponent,
} from '../encuestas/confirmacion/confirmacion.component';
import { Sesion } from '../sesion/sesion';
import {
  SesionEditComponent,
} from '../sesion/sesion-edit/sesion-edit.component';
import { TipoSesion } from '../tipo-sesion/tipo-sesion';
import { TipoSesionService } from '../tipo-sesion/tipo-sesion.service';
import { BuscarContestacionesService } from './monitor.component.service';
import { GeneralComponent } from '../common/general-component';
import { LocationStrategy } from '@angular/common';
import { EmprendedorFilter } from '../emprendedor/emprendedor-filter';
import { Emprendedor } from '../emprendedor/emprendedor';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css',
})
export class BuscarContestacionesComponent extends GeneralComponent implements OnInit {
  @ViewChildren('stepper') steppers!: QueryList<MatStepper>;
  fechaIni!: Date; // Variable para almacenar la fecha inicial
  fechaFin!: Date; // Variable para almacenar la fecha final

  displayedColumns: string[] = [
    'conId',
    'conNombre',
    'conFecha',
    'resultado',
    'grafica0',
    'grafica1',
    'grafica2',
    'grafica3',
    'grafica4',

    //'grafica',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  resultados: any[] = [];

  stepData = [
    { title: 'Paso 1', iconType: '1', status: 'pending' },
    { title: 'Paso 2', iconType: 'radio_button_checked', status: 'active' },
    { title: 'Paso 3', iconType: 'check_circle', status: 'done' },
  ];
  grupos: any[] = [];
  preguntas: Pregunta[] = [];
  preguntasVisibles: Pregunta[] = [];
  valoresPonderadosPorPilar: ValorPonderadoPorPilar[] = [];
  pilarActualIndex: number = 0;
  pilarFinal: number = 0;
  id: string = '';
  tisModel!: TipoSesion[];
  tisId!: number;
  promedioPilar: number = 0;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  empId!: number;

  //Buscador Razon Social
  empFilter!: string;
  empRfc!: string;
  empModelFilter!: Emprendedor[];
  emp!: Emprendedor;
  filter = new EmprendedorFilter();

  steps = [
    'Diagnóstico',
    'Entrevista',
    'DEVIFACI',
    'Actividades A3',
    'Finalizado',
  ];
  /* Constructores */
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private http: HttpClient,
    private buscarContestacionesService: BuscarContestacionesService,
    private router: Router,
    private route: ActivatedRoute,
    private preguntaListService: CuestionarioService,
    private _formBuilder: FormBuilder,
    private emprendedorService: EmprendedorService,
    private tisService: TipoSesionService,
    private paginatoor: MatPaginatorIntl,
    protected override locationStrategy: LocationStrategy
  ) {
    super(locationStrategy);
    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';

    this.paginatoor.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.tisService.findAll().subscribe({
      next: async (tiss) => {
        this.tisModel = tiss;
        console.log();
        console.log('El tipo de sesión debería ser: ');
        console.log(tiss);
        console.log(this.tisModel);

        this.tisId = 0;
        //  this.search();
      },
      error: (error) => {
        alert(error.message);
      },
    });

    this.empId = 1;
    this.filter.empId = '0';
  }


  ngOnInit(): void {
    this.fechaIni = startOfMonth(new Date());
    this.fechaFin = endOfToday();
    this.sendInfo();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addManualEvent(
    day: Date | undefined,
    element: any,
    stepNumber: number
  ): void {
    let newSesion: Sesion = new Sesion();
    newSesion.sesId = 0;
    newSesion.sesTisId = this.tisId;
    newSesion.sesEmpId = 0;

    if (day != undefined) {
      newSesion.sesHoraIni = day.toJSON();
      newSesion.sesHoraFin = day.toJSON();
    } else {
      const today = startOfDay(new Date());
      newSesion.sesHoraIni = today.toJSON();
      newSesion.sesHoraFin = today.toJSON();
    }
    newSesion.sesEmpId = element.empId;
    if (stepNumber < 3) {
      newSesion.sesTisId = 1;
    }



    const confirmaDialog = this.dialog.open(SesionEditComponent, {
      data: { sesion: newSesion, tisModel: this.tisModel },
      height: '500px',
      width: '600px',
    });

    confirmaDialog.afterClosed().subscribe((result) => {


      if (result) {
        this.emprendedorService
          .addEmprendedoresEtapa(1, element.empId, 2, 1)
          .subscribe({
            next: (res) => {

              this.sendInfo();
            },
            error: (error) => {
              alert('Error al guardarEmprendedor etapa');
            },
          });
      }
    });
  }
  // Método para obtener el ícono del paso basado en el estado
  determineIcon(iconType: string): string {
    return iconType; // Directamente devuelve el ícono
  }

  // Método para obtener el color del paso basado en el estado
  determineColor(status: string): string {
    switch (status) {
      case 'done':
        return '#35A255'; // Verde
      case 'active':
        return '#007CBB'; // Azul
      case 'pending':
        return 'rgba(0, 0, 0, 0.54)'; // Gris
      default:
        return 'black'; // Color por defecto
    }
  }

  // Función para evaluar el estado de un paso
  evaluateStep(stepNumber: number, element: any): boolean {
    switch (stepNumber) {
      case 1:
        return (
          element.SesExisten1 === 1 &&
          element.SesCompleto1 === element.ObjCuantos1
        );
      case 2:
        return (
          element.SesExisten2 === 1 &&
          element.SesCompleto2 === element.ObjCuantos2
        );
      default:
        return false;
    }
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

    return `${datePart}  ${timePart}`;
  }

  getStepClass(index: number, element: any): string {
    switch (index + 1) {
      case 1:
        return element.etaId1 === 1 ? 'completed-step' : 'pending-step';
      case 2:
        if (element.etaId2 === 0 && element.seoCuantos1 == 0)
          return 'pending-step';
        if (element.etaId2 == 1 && element.seoCuantos1 == 0) {
          return 'parcial';
        }
        if (
          element.objCuantos1 > 0 &&
          element.seoCuantos1 === element.objCuantos1
        ) {
          return 'completed-step';
        } else {
          return 'pending-step';
        }

      case 3:
        if (element.etaId3 === 0 && element.seoCuantos2 == 0)
          return 'pending-step';
        if (
          element.seoCuantos2 > 0 &&
          element.seoCuantos2 === element.objCuantos2
        ) {
          return 'completed-step';
        } else {
          return 'parcial';
        }
      case 4:
        if (element.etaId4 === 0) return 'pending-step';
        if (
          element.reaCuantos > 0 &&
          element.reaCuantos === element.eviCuantos
        ) {
          return 'completed-step';
        } else {
          return 'parcial';
        }
      case 5:
        return element.etaId5 === 1 ? 'completed-step' : 'pending-step';
      default:
        return 'pending-step';
    }
  }

  getStepIcon(stepNumber: number): string {
    switch (stepNumber) {
      case 1:
        return 'picture_as_pdf';
      case 2:
        return 'record_voice_over';
      case 3:
        return 'assignment';
      case 4:
        return 'event_available';
      case 5:
        return 'all_inclusive';
      default:
        return '';
    }
  }

  handleClick(element: any): void {
    console.log('Elemento clickeado:', element);
    // Aquí puedes agregar la lógica que necesites
    this.emprendedorService.findById(element.empId).subscribe({
      next: (res) => {
        console.log('Respuesta petición');
        console.log(res);
        const detallesEmprendedor = `
        Razón Social: ${res.empRazonSocial}<br/>
        Domicilio: ${res.empDomicilio}<br/>
        Correo: ${res.empCorreo}<br/>
        Teléfono: ${res.empTelefono}<br/>
        Clave: ${res.empClave}
      `;
        const confirmaDialog = this.dialog.open(ConfirmacionComponent, {
          data: {
            titulo: 'Información de emprendedor',
            mensaje: `${detallesEmprendedor}`,
            mostrarConfirmar: true,
          },
          height: '300px',
          width: '450px',
          minWidth: '500px',
          maxWidth: '450px',
        });

        confirmaDialog.afterClosed().subscribe((result) => {
          if (result) {
          }
        });
      },
      error: (error) => {
        console.log('Error petición');
        console.log(error);
      },
    });
    // this.router.navigate([`/cuestionario/${conId}/result`]);
  }

  hasError(index: number): boolean {
    // Lógica para determinar si hay un error en el paso
    return false; // Suponiendo que no hay errores por defecto
  }

  // Función para evaluar si un paso es pendiente
  isPendingStep(stepNumber: number, element: any): boolean {
    switch (stepNumber) {
      case 1:
        return element.SesExisten1 === 0;
      case 2:
        return element.SesExisten2 === 0;
      default:
        return false;
    }
  }

  // Función para evaluar si un paso es parcial
  isPartialStep(stepNumber: number, element: any): boolean {
    switch (stepNumber) {
      case 1:
        return (
          element.SesExisten1 === 1 &&
          element.SesCompleto1 !== element.ObjCuantos1
        );
      case 2:
        return (
          element.SesExisten2 === 1 &&
          element.SesCompleto2 !== element.ObjCuantos2
        );
      default:
        return false;
    }
  }

  newDocument() {
    // Lógica para manejar la creación de un nuevo documento
    console.log('Creando un nuevo documento');
  }

  onStepChange(
    event: StepperSelectionEvent,
    allowed: number,
    stepperIndex: number,
    element: any
  ): void {
    const stepper = this.steppers.toArray()[stepperIndex];
    const currentIndex = event.selectedIndex;
    const selectedStepIndex = currentIndex + 1; // Ya que 'element.emeEtaId' se basa en índices de 1 a 5
    console.log('currentIndex');
    console.log(currentIndex);
    console.log('previouslySelectedStep');
    if (selectedStepIndex > allowed + 1) {
      this.toastr.warning(
        'No puedes proseguir sin completar en secuencia las etapas.'
      );
      setTimeout(() => {
        stepper.selectedIndex = stepper.selectedIndex > 0 ? allowed - 1 : 0;
      });
      return;
    }
    if (selectedStepIndex == 3 && element.sesFecha.trim() == '') {
      this.toastr.warning(
        'No puedes acceder al paso dos sin una sesión previa.'
      );
      setTimeout(() => {
        stepper.selectedIndex = stepper.selectedIndex > 0 ? allowed - 1 : 0;
      });
      return;
    }

    if (selectedStepIndex > allowed) {
      let mensaje = '';

      switch (selectedStepIndex) {
        case 2:
          mensaje = '¿Está seguro de calendarizar la entrevista?';
          break;
        case 3:
          mensaje = '¿Está seguro de calendarizar las sesiones DEVIFACI?';
          break;
        case 4:
          mensaje = '¿Está seguro de iniciar el registro de actividades A3?';
          break;
        case 5:
          mensaje = '¿Está seguro de finalizar el proceso del Emprendedor?';
          break;
        default:
          mensaje = '';
          break;
      }

      const confirmaDialog = this.dialog.open(ConfirmacionComponent, {
        data: {
          titulo: 'Confirmación',
          mensaje: mensaje,
        },
        height: '200px',
        width: '450px',
        minWidth: '500px',
        maxWidth: '450px',
      });

      confirmaDialog.afterClosed().subscribe((result) => {
        if (result) {
          // Permitir el cambio de paso
          console.log('Elemento completo por actualizar');
          console.log(element.emeId);
          console.log(currentIndex);

          this.emprendedorService
            .updateEmprendedoresEtapa(element.emeId, currentIndex + 1)
            .subscribe({
              next: (res) => {
                console.log('Actualizado correctamente');
                this.sendInfo();
              },
              error: (error) => {
                console.log('Error al actualizar');
              },
            });
          stepper.selectedIndex = currentIndex; // Avanzar al paso siguiente
        } else {
          // Revertir al paso anterior
          setTimeout(() => {
            stepper.selectedIndex = stepper.selectedIndex > 0 ? allowed - 1 : 0;
          });
        }
      });
    }
  }

  onStepClick(
    stepNumber: number,
    id: number,
    allowed: number,
    element: any
  ): void {
    let mensaje = '';
    console.log(allowed);
    console.log("Element enviado");
    console.log(element);


    if (stepNumber === 1) {
      // Ejecuta la función específica si se hace clic en el botón del primer paso
      this.searchPreguntas(id, element.empRfc, element);
      return;
    }
    if (stepNumber == 2 && element.etaId2 == 1) {
      return;
    }

    if (stepNumber == 2) {
      if (
        element.seoCuantos1 === element.objCuantos1 &&
        element.seoCuantos1 > 0
      ) {
        this.toastr.warning('La entrevista ya ha sido realizada con éxito.');
        this.empId = element.empId;
        return;
      } else {
        // this.toastr.warning(
        //   'Agendar y llevar proceso de entrevista en calendario.'
        // );
      }

    }

    if (stepNumber == 3) {
      if (
        element.etaId3 == 1 &&
        (element.seoCuantos2 != element.objCuantos2 || element.seoCuantos2 == 0)
      ) {
        this.toastr.warning('Agendar y ejecutar las sesiones devifaci.');
        return;
      }

      if (element.etaId3 == 1 && element.seoCuantos2 == element.objCuantos2 && element.seoCuantos2 > 0) {
        this.toastr.warning('Las sesiones DEVIFACI han sido realizadas con éxito.');
        return;
      }
    }

    if (stepNumber == 4) {
      if (
        element.etaId4 == 1 &&
        (element.eviCuantos != element.reaCuantos || element.eviCuantos == 0)
      ) {
        this.toastr.warning('Adjuntar las evidencias de las actividades correspondientes.');
        return;
      }
    }
    if (stepNumber == 5) {
      if (element.etaId5 == 1) {
        this.toastr.warning('El proceso ya ha sido finalizado');
        return;
      }
    }
    console.log("STEP NUMBER");
    console.log(stepNumber);
    console.log("element.etaId2");
    console.log(element.etaId2);


    if (
      stepNumber == 2 || (stepNumber > 2 &&
        element.etaId1 == 1 &&
        element.seoCuantos1 > 0 &&
        element.seoCuantos1 === element.objCuantos1 &&
        element.objCuantos1 > 0 &&
        element.seoCuantos1 === element.objCuantos1)
    ) {
      switch (stepNumber) {
        case 2:
          mensaje = '¿Está seguro de calendarizar la entrevista?';
          break;
        case 3:
          mensaje = '¿Está seguro de calendarizar las sesiones DEVIFACI?';
          break;
        case 4:
          mensaje = '¿Está seguro de iniciar el registro de actividades A3?';
          break;
        case 5:
          mensaje = '¿Está seguro de finalizar el proceso del Emprendedor?';
          break;
        default:
          mensaje = '';
          break;
      }
      console.log("confirmando dialogo");

      const confirmaDialog = this.dialog.open(ConfirmacionComponent, {
        data: {
          titulo: 'Confirmación',
          mensaje: mensaje,
        },
        height: '200px',
        width: '450px',
        minWidth: '500px',
        maxWidth: '450px',
      });

      confirmaDialog.afterClosed().subscribe((result) => {
        if (result) {
          // Permitir el cambio de paso
          console.log('Elemento completo por actualizar');
          console.log(element.emeId);
          console.log(stepNumber);

          this.emprendedorService
            .addEmprendedoresEtapa(1, element.empId, stepNumber, 1)
            .subscribe({
              next: (res) => {
                this.sendInfo();
              },
              error: (error) => {
                console.log('Error al actualizar');
              },
            });
        } else {
          // Revertir al paso anterior
        }
      });
      console.log(`Se hizo clic en el botón del paso ${stepNumber}`);
      return;
    } else {
      this.toastr.warning('Paso inaccesible.');
      return;
    }
  }

  searchPreguntas(idContestacion: number, rfcUser: string, element: any) {
    console.log('Traer datos de contestación actual:');
    this.buscarContestacionesService.getSumapilares(idContestacion).subscribe({
      next: (res) => {
        console.log('Respuesta a la suma');
        console.log(res);
      console.log("Esto se va a imprimir");
      console.log(element);
      
      let bodyRequest = {
        datosEncuesta : res, 
        nombre: element.empName,
        razonSocial: element.empRazonSocial        
      }; 

      this.preguntaListService.generatePdfFile(bodyRequest).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          // Obtener la fecha y restar 6 horas
          const date = new Date();
          date.setHours(date.getHours() - 6); // Resta 6 horas

          // Formatear la fecha como yyyyMMddHHmmss
          const formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 15);
          const fileName = `${rfcUser}_${formattedDate}`;

          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
        error: (error) => {
          this.toastr.error('Error al generar archivo.');
        },
      });
      
        
      },
      error: (error) => {
        console.log('Error de la busqueda');
        console.log(error);
      },
    });

    return;
  }



  sendInfo() {
    // Lógica para manejar el envío de información cuando cambian las fechas
    console.log('Información enviada', this.fechaIni, this.fechaFin);
    // Aseguramos que la fecha inicial sea el inicio del día
    this.fechaIni = startOfDay(this.fechaIni);
    // Aseguramos que la fecha final sea el final del día seleccionado
    this.fechaFin = endOfDay(this.fechaFin);
    if (this.fechaIni == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una fecha inicial',
        'Precaución'
      );
      return;
    }
    if (this.fechaFin == undefined) {
      this.toastr.warning(
        'Es necesario seleccionar una fecha final',
        'Precaución'
      );

      return;
    }

    this.buscarContestacionesService
      .searchPreguntas(this.fechaIni.toJSON(), this.fechaFin.toJSON(), this.filter.empId)
      .subscribe({
        next: (res) => {
          console.log('respuesta:');
          console.log(res);
          this.resultados = res;
          this.dataSource.data = this.resultados.reverse();
        },
        error: (error) => {
          this.toastr.warning(
            'No hay resultados para el rango de fechas ingresado.'
          );
          this.resultados = [];
          this.dataSource.data = [];
        },
      });
  }





  //----------------------- Filtro Razon Social
  changeRazonFilter() {
    let empFilter = new EmprendedorFilter();
    empFilter.empPatron = this.empFilter;
    this.emprendedorService.findByPatternAll(empFilter).subscribe({
      next: (emps) => {
        this.empModelFilter = emps;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }


  cleanRazon() {
    this.empFilter = '';
    this.emp = new Emprendedor();
    this.empId = 0;
    this.filter.empId = '0';
    this.sendInfo();
  }

  cleanRazonInput() {
    this.empFilter = '';
  }


  displayFn(emp: Emprendedor): string {
    return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
  }


  selectRazon(sesion: any) {
    if (sesion.option) {
      this.emp = sesion.option.value;
      this.empId = this.emp.empId;
      this.filter.empId = this.empId.toString();
      this.sendInfo();
      console.log('Emprendedor seleccionado: ', this.empId);
    }
  }
}
