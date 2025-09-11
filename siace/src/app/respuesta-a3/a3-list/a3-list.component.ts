import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Actividad } from '../../actividad/actividad';
import { ActividadFilter } from '../../actividad/actividad-filter';
import { ActividadService } from '../../actividad/actividad.service';
import { GeneralService } from '../../common/general.service';
import { Emprendedor } from '../../emprendedor/emprendedor';
import { EmprendedorFilter } from '../../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../../emprendedor/emprendedor.service';
import { NivelService } from '../../nivel/nivel.service';
import { A3EditComponent } from '../a3-edit/a3-edit.component';


@Component({
   selector: 'app-a3-list',
   templateUrl: './a3-list.component.html',
   styleUrls: ['./a3-list.component.css'],
})
export class A3ListComponent implements OnInit {
   @Input('aaaNivId') aaaNivId!: number;
   @Input('aaaPilId') aaaPilId!: number;
   @Input('aaaEmpId') aaaEmpId!: number;
   empId!: number;
   actividades: Actividad[] = [];
   //idPilar: number | null = null;
   actividadCheckboxState: { [idActividad: number]: boolean } = {};
   selectedActividad: Actividad | null = null;

   // Define displayed columns for each role
   displayedColumnsClient: string[] = ['actividad', 'checkbox'];
   displayedColumnsAdmin: string[] = ['actividad', 'checkbox'];

   dataSource = new MatTableDataSource<Actividad>(this.actividades);
   dataSource1 = new MatTableDataSource<Actividad>(this.actividades);

   //Buscador de emprededores
   empFilter!: string;
   empModelFilter!: Emprendedor[];
   emp!: Emprendedor;

   niveles: { nivId: number; nivDescripcion: string }[] = [];

   evidenciasRealizadasTotal: number = 0;
   evidenciasTotalesTotal: number = 0;
   porcentajeActividades: number = 0;

   @Output() porcentajeActividadesEmit = new EventEmitter<{ porcentaje: number, pilarId: number, nivId: number }>();
   @Output() buscarNivel: EventEmitter<void> = new EventEmitter<void>();


   constructor(
      private actividadesService: ActividadService,
      public dialog: MatDialog,
      private toastr: ToastrService,
      protected empService: EmprendedorService,
      private nivelService: NivelService,
      private generalService: GeneralService
   ) {
      this.empModelFilter = [];

   }

   ngOnInit(): void {
      this.search();

      this.searchActividades();
   }


   /* Metodos */
   changeEmprendedorFilter() {
      let empFilter = new EmprendedorFilter();
      empFilter.empPatron = this.empFilter;
      this.empService.findByPattern(empFilter).subscribe({
         next: (emps) => {
            this.empModelFilter = emps;
         },
         // error: (err) => {
         //    this.toastr.error('Ha ocurrido un error', 'Error');
         // },
      });
   }


   cleanEmprendedor() {
      this.empFilter = '';
      this.emp = new Emprendedor();
      this.empId = 0;
      this.search();
   }


   displayFn(emp: Emprendedor): string {
      return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
   }


   openEvidenciasModal(actividad: Actividad): void {
      if (this.aaaPilId !== null) {
         const dialogRef = this.dialog.open(A3EditComponent, {
            width: '600px',
            height: '600px',
            data: {
               pilId: this.aaaPilId,
               aaaId: actividad.aaaId,
               aaaDescripcion: actividad.aaaDescripcion,
               empId: this.empId?this.empId:this.aaaEmpId
            },
         });

         dialogRef.componentInstance.evidenciasCambios.subscribe(() => {
            this.updateActividadEvidenciaTabs(actividad);
         });

         dialogRef.componentInstance.dataActualizada.subscribe(() => {
            this.buscarNivel.emit();
         })

         dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
         });
      } else {
         console.error('idPilar is null');
      }
   }


   search() {
      if (this.aaaNivId && this.empId) {
         console.log(this.aaaNivId, this.empId);
         let aaaFilter = new ActividadFilter();
         aaaFilter.aaaNivId = this.aaaNivId.toString();
         aaaFilter.aaaPilId = this.aaaPilId.toString();
         aaaFilter.empId = this.empId.toString();

         this.actividadesService.find(aaaFilter).subscribe({
            next: (acts) => {
               this.actividades = acts;
               this.dataSource.data = this.actividades;
            },
            error: (err) => {
               console.log('Error');
            },
         });
      }
   }


   selectActividad(actividad: Actividad): void {
      this.selectedActividad = actividad;
   }

   
   selectEmprendedor(sesion: any) {
      if (sesion.option) {
         this.emp = sesion.option.value;
         this.empId = this.emp.empId;
         this.search();
      }
   }

   selectNivel(nivId: number): void {
      this.aaaNivId = nivId;
      this.search(); // Volver a cargar las actividades con el nuevo nivel seleccionado
      this.searchActividades();
      console.log("Nivel seleccionado: ", this.aaaNivId);
   }


   updateActividadEvidencia(actividad: Actividad): void {
      let aaaFilter = new ActividadFilter();
      aaaFilter.aaaNivId = this.aaaNivId.toString();
      aaaFilter.aaaPilId = this.aaaPilId.toString();
      aaaFilter.empId = this.empId.toString();

      this.actividadesService.find(aaaFilter).subscribe({
         next: (acts) => {
            this.actividades = acts;
            this.dataSource.data = this.actividades;
            //this.calcularEvidencias();
         },
         error: (err) => {
            console.log('Error');
         },
      });
   }


   // -------------------------------------------   Funciones para tabs

   searchActividades() {
      if (this.aaaNivId && this.aaaPilId && this.aaaEmpId) {
         //console.log(this.aaaNivId, this.aaaPilId);
         let aaaFilter = new ActividadFilter();
         aaaFilter.aaaNivId = this.aaaNivId.toString();
         aaaFilter.aaaPilId = this.aaaPilId.toString();
         aaaFilter.empId = this.aaaEmpId.toString();

         this.actividadesService.find(aaaFilter).subscribe({
            next: (acts) => {
               this.actividades = acts;
               this.dataSource1.data = this.actividades;
            },
            error: (err) => {
               console.log('Error');
            },
         });
      }
   }


   updateActividadEvidenciaTabs(actividad: Actividad): void {
      let aaaFilter = new ActividadFilter();
      aaaFilter.aaaNivId = this.aaaNivId.toString();
      aaaFilter.aaaPilId = this.aaaPilId.toString();
      aaaFilter.empId = this.aaaEmpId.toString();

      this.actividadesService.find(aaaFilter).subscribe({
         next: (acts) => {
            this.actividades = acts;
            this.dataSource1.data = this.actividades;
         },
         error: (err) => {
            console.log('Error');
         },
      });
   }
}
