import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../common/general.service';
import { Emprendedor } from '../emprendedor/emprendedor';
import { EmprendedorFilter } from '../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { ApplicationUser } from '../login/login.service';
import { Nivel } from '../nivel/nivel';
import { NivelFilter } from '../nivel/nivel-filter';
import { NivelService } from '../nivel/nivel.service';
import { Pilar } from '../pilar/pilar';
import { PilarFilter } from '../pilar/pilar-filter';
import { PilarService } from '../pilar/pilar.service';
import { A3ListComponent } from './a3-list/a3-list.component';


@Component({
   selector: 'app-respuesta-a3',
   templateUrl: './respuesta-a3.component.html',
   styleUrl: './respuesta-a3.component.css'
})
export class RespuestaA3Component implements OnInit {
   @ViewChildren(A3ListComponent) a3ListComponents!: QueryList<A3ListComponent>;
   selectedPilarId: number | null = null;
   //niveles: { nivId: number; nivDescripcion: string, porcentajeNivel: number }[] = [];
   @Input('aaaNivId') aaaNivId: number = 1;

   versionCheck!: boolean;
   empSelect!: boolean;

   //Buscador de emprededores
   empFilter!: string;
   empModelFilter!: Emprendedor[];
   emp!: Emprendedor;
   empId!: number;
   logEmpId!: number;

   //Sesion id
   user!: ApplicationUser;
   //sesEmpId!: number;
   nivelLocal: Nivel[] = [];
   pilarLocal: Pilar[] = [];
   panelState: boolean[] = [];

   evidenciasRealizadasTotal: number = 0;
   evidenciasTotalesTotal: number = 0;
   porcentajeActividades: { [pilarId: number]: number } = {};
   porcentajeNivel: { [nivId: number]: number } = {};
   porcentajeGlobal: { [nivId: number]: number } = {};

   filter = new NivelFilter();
   filterPilar = new PilarFilter();


   constructor(
      private pilaresService: PilarService,
      private nivelService: NivelService,
      private empService: EmprendedorService,
      private toastr: ToastrService,
      private cdr: ChangeDetectorRef,
      private generalService: GeneralService
   ) {
      // this.nivId=1;
      this.user = JSON.parse(localStorage.getItem("user")!);
      this.logEmpId = this.user.empId;
      this.empId = this.logEmpId;
      this.versionCheck = false;
      this.empSelect = false;
   }

   
   /* Accesors */

   get niveles(): Nivel[] {
      //  return this.nivelService.nivelList;
      this.nivelLocal = this.nivelService.nivelList;
      //  console.log('Este es el nivelLocal', this.nivelLocal);
      return this.nivelLocal;
   }


   get pilares() {
      this.pilarLocal = this.pilaresService.pilarList;
      return this.pilarLocal;
   }


   ngOnInit(): void {
   }


   ngAfterViewInit() {
      if(this.logEmpId){
         this.checkVersion(this.logEmpId);
         this.empSelect = true;
      }
   }


   /* Metodos */

   //---------------- Filtro emprendedor
   checkVersion(empId: number){
      this.empService.checkVersion(empId).subscribe({
         next: (result: number) => {
            this.versionCheck = result === 1;
            if(this.versionCheck){
               console.log('Tiene version');
               this.searchNivel();
            } else{
               console.log('No tiene version');
            }
         },
         error: (error) => {
            console.error("Error al verificar la versión:", error);
         }
      });
   }


   changeEmprendedorFilter() {
      let empFilter = new EmprendedorFilter();
      empFilter.empPatron = this.empFilter;
      this.empService.findByPatternAll(empFilter).subscribe({
         next: (emps) => {
            this.empModelFilter = emps.sort((a, b) => a.empRazonSocial.localeCompare(b.empRazonSocial));
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
      this.searchNivel();
      this.empSelect = false;
   }


   getPilares(): void {
      this.filterPilar.empId = this.empId.toString();
      this.filterPilar.nivId = this.aaaNivId.toString();
      this.pilaresService.loadPilar(this.filterPilar);
   }


   onPanelOpen(pilar: Pilar): void {
      this.selectedPilarId = pilar.pilId;
   }


   onTabChange(index: number): void {
      const selectedNivel = this.niveles[index];
      if (selectedNivel) {
         this.aaaNivId = selectedNivel.nivId;
         console.log('Nivel seleccionado: ', this.aaaNivId);
      }
      this.getPilares();
   }


   // -------------------------------------------   Funciones para tabs
   displayFn(emp: Emprendedor): string {
      return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
   }


   searchNivel(): void {
      this.filter.empId = this.empId.toString();
      this.nivelService.findNivel(this.filter).subscribe({
         next: result => {
            this.nivelService.nivelList = result;
            this.getPilares();
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
      //this.nivelService.loadNivel(this.filter);
   }


   selectEmprendedor(sesion: any) {
      if (sesion.option) {
         this.emp = sesion.option.value;
         this.empId = this.emp.empId;
         this.empSelect = true;
         this.checkVersion(this.empId);
         //this.searchNivel();
         console.log('Emprendedor seleccionado: ', this.empId);
      }
   }


   onPorcentaje(event: { porcentaje: number, pilarId: number, nivId: number }) {
      this.porcentajeActividades[event.pilarId] = event.porcentaje;
      this.porcentajeNivel[event.nivId] = event.porcentaje;
      // Solución para el error de expresión cambiada después de ser verificada
      setTimeout(() => {
         this.cdr.detectChanges();
      });

   }


   refreshData() {
      let nivFilter = new NivelFilter();
      nivFilter.empId = this.empId.toString();

      this.nivelService.findNivelPorcentaje(nivFilter).subscribe({
         next: (niveles: Nivel[]) => {
            for (let i = 0; i < niveles.length; i++) {
               if (this.nivelLocal[i]) {
                  this.nivelLocal[i]["porcentajeNivel"] = niveles[i]["porcentajeNivel"];
               }
            }

         },
         error: (err) => {
            console.error('Error obteniendo niveles:', err);
         }
      });

      let pilFilter = new PilarFilter();
      pilFilter.empId = this.empId.toString();
      pilFilter.nivId = this.aaaNivId.toString();

      this.pilaresService.findPilarPorcentaje(pilFilter).subscribe({
         next: (pilares: Pilar[]) => {
            for (let i = 0; i < pilares.length; i++) {
               if (this.pilarLocal[i]) {
                  this.pilarLocal[i]["porcentajePilar"] = pilares[i]["porcentajePilar"];
               }
            }

         },
         error: (err) => {
            console.error('Error obteniendo pilares:', err);
         }
      });
   }
}