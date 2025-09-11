import { LocationStrategy } from '@angular/common';
import {
   AfterViewInit,
   Component,
   OnDestroy,
   OnInit,
   ViewChild,
   ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
   CalendarEvent,
   CalendarEventAction,
   CalendarEventTimesChangedEvent,
   CalendarView,
} from 'angular-calendar';
import {
   endOfYear,
   isSameDay,
   isSameMonth,
   startOfYear,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import {
   merge,
   of,
   Subject,
   Subscription,
} from 'rxjs';
import {
   startWith,
   switchMap,
} from 'rxjs/operators';
import {
   ConfirmDialogComponent,
} from '../common/confirm-dialog/confirm-dialog.component';
import { GlobalComponent } from '../common/global-component';
import { Emprendedor } from '../emprendedor/emprendedor';
import { EmprendedorFilter } from '../emprendedor/emprendedor-filter';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { Sesion } from '../sesion/sesion';
import {
   SesionEditComponent,
} from '../sesion/sesion-edit/sesion-edit.component';
import { SesionFilter } from '../sesion/sesion-filter';
import { SesionService } from '../sesion/sesion.service';
import { TipoSesion } from '../tipo-sesion/tipo-sesion';
import { TipoSesionService } from '../tipo-sesion/tipo-sesion.service';


export const colors: any = {
   red: {
      primary: '#FF0000',
      secondary: '#FAE3E3',
   },
   green: {
      primary: '#00FF00',
      secondary: '#d1ffd6',
   },
   yellow: {
      primary: '#ffe600',
      secondary: '#FDF1BA',
   },
   orange: {
      primary: '#ff8800',
      secondary: '#e29f52',
   },
   black: {
      primary: '#000000',
      secondary: '#3d403b',
   },
   gray: {
      primary: '#808080',
      secondary: '#bdb9b9',
   },
};

@Component({
   selector: 'calendar',
   //changeDetection: ChangeDetectionStrategy.OnPush, Se quitó por que no se cargan los combos
   templateUrl: './calendario.component.html',
   styleUrls: ['./calendario.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class CalendarioComponent extends GlobalComponent implements OnInit, OnDestroy, AfterViewInit {

   view: CalendarView = CalendarView.Month;

   CalendarView = CalendarView;
   locale: string = "es";
   viewDate: Date = new Date();
   viewTable: boolean = false;

   tisModel!: TipoSesion[];
   sesModel!: Sesion[];
   sesPendingModel!: Sesion[];
   sesModeloPendiente!: Sesion[];
   sesPendingDataSource!: Sesion[];
   sesPendientes!: Sesion[];
   tisId!: number;
   empModelFilter!: Emprendedor[];

   sesFilter!: SesionFilter;
   private subs!: Subscription;
   showAll: boolean = false;

   actions!: CalendarEventAction[];

   @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
   refresh: Subject<any> = new Subject();
   activeDayIsOpen: boolean = true;
   events: CalendarEvent[] = [];
   emp!: Emprendedor;
   empFilter!: string;

   nuevaSesion!: boolean;


   /* Iniciaización */

   constructor(protected override empService: EmprendedorService,
      private sesionService: SesionService,
      private tisService: TipoSesionService,
      public dialog: MatDialog,
      private toastr: ToastrService,
      protected override locationStrategy: LocationStrategy,
      private ToastrService: ToastrService
      /*,

      private renderer: Renderer2*/) {
      super(empService, locationStrategy);
      this.sesFilter = new SesionFilter();

      this.subs = this.sesionService.getIsUpdated().subscribe(() => {
         this.search();
      });

      //this.ToastrService.success('Se ha guardado la información", "Transacción exitosa');
      this.sesFilter.sesId = '0';
      this.sesPendingModel = [];
      this.sesModeloPendiente = [];
      this.viewTable = false;
      this.actions = this.createActions();
      this.empModel = [];
      this.empModelFilter = [];
      this.emp = new Emprendedor();
      this.emp.empId = 0;

      this.tisService.findByEmp(this.emp.empId).subscribe({
         next: async tiss => {
            this.tisModel = tiss;
            this.tisId = 0;
            this.search();
         },
         error: error => {
            alert(error.message);
         }
      });
      this.nuevaSesion = false;
   }


   ngAfterViewInit() {
      this.paginator._intl.itemsPerPageLabel = "No. de Elementos";
      this.paginator._intl.getRangeLabel = (page: number, size: number, len: number) => {
         let currSize = (page + 1) * size;
         return (currSize > len ? len : currSize) + ' de ' + len;
      };
   }


   ngOnDestroy(): void {
      this.subs?.unsubscribe();
   }


   /* Métodos de la clase */

   addEvent(sesion: Sesion): void {
      this.events = [
         ...this.events,
         {
            id: sesion.sesId,
            title: sesion.sesDescripcion,
            start: new Date(sesion.sesHoraIni),
            end: new Date(sesion.sesHoraFin),
            actions: this.actions,
            color: sesion.sesColor == 'red' ? colors.red : (sesion.sesColor == 'green' ? colors.green : (sesion.sesColor == 'gray' ? colors.gray : (sesion.sesColor == 'black' ? colors.black : (sesion.sesColor == 'orange' ? colors.orange : colors.yellow)))),
            draggable: false,
            resizable: {
               beforeStart: false,
               afterEnd: false,
            },
            cssClass: 'light-unlight'
         },
      ];
   }


   addManualEvent(day: Date | undefined): void {
      let newSesion: Sesion = new Sesion();
      newSesion.sesId = 0;
      newSesion.sesTisId = this.tisId;
      newSesion.sesEmpId = this.emp.empId;
      console.log('Emprendedor selec: ', newSesion.sesEmpId);
      if (day != undefined) {
         newSesion.sesHoraIni = day.toJSON();
         newSesion.sesHoraFin = day.toJSON();
      }
      else {
         let now = new Date();
         let today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
         newSesion.sesHoraIni = today.toJSON();
         today.setMinutes(today.getMinutes() + 60);
         newSesion.sesHoraFin = today.toJSON();
      }

      this.dialog.open(SesionEditComponent, {
         data: { sesion: newSesion, tisModel: this.tisModel },
         height: '500px',
         width: '600px',
         disableClose: true
      });
   }


   attendSesion(sesion: Sesion) {
      const dialogRef = this.dialog.open(SesionEditComponent, {
         data: { sesion: JSON.parse(JSON.stringify(sesion)), tisModel: this.tisModel},
         height: '80vh',
         width: '600px',
         maxHeight: '90vh',
      });

      dialogRef.componentInstance.archivoCargado.subscribe(() => {
         this.search();
      });

      dialogRef.afterClosed().subscribe(result => {
         console.log(result);
         this.sesPendingDataSource.filter(f => f.checked).forEach((ele, idx) => { ele.checked = false });
      });
   }


   castSesiones(sesiones: CalendarEvent[]): CalendarEvent[] {
      return sesiones;
   }


   changeEmprendedorFilter() {
      //this.empModelFilter=this.empModel.filter(f=>f.empRazonSocial.toLowerCase().includes(this.empFilter));
      let empFilter = new EmprendedorFilter();
      empFilter.empPatron = this.empFilter;
      this.empService.findByPatternAll(empFilter).subscribe({
         next: (emps) => {
            this.empModelFilter = emps;
         },
         //error: err=>{this.toastr.error('Ha ocurrido un error', 'Error');}
      });
   }


   cleanEmprendedor() {
      this.empFilter = '';
      this.emp = new Emprendedor();
      this.search();
   }


   closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;

      /*let dateIni:Date= new Date(this.eveFilter.eveFechaIni);
      let dateEnd:Date= new Date(this.eveFilter.eveFechaFin);
      if(this.viewDate<dateIni || this.viewDate>dateEnd){
         this.search();
      }*/
   }


   createActions() {
      return [
         {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Editar',
            onClick: ({ event }: { event: CalendarEvent }): void => {
               let ses: Sesion = this.sesModel.filter(f => f.sesId == event.id)[0];

               const dialogRef = this.dialog.open(SesionEditComponent, {
                  data: { sesion: JSON.parse(JSON.stringify(ses)), tisModel: this.tisModel },
                  height: '450px',
                  width: '600px',
                  disableClose: true
               });

               dialogRef.componentInstance.archivoCargado.subscribe(() => {
                  this.search();
               });
            },
         },
         {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Borrar',
            onClick: ({ event }: { event: CalendarEvent }): void => {
               let ses: Sesion = this.sesModel.filter(f => f.sesId == event.id)[0];

               const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                  data: {
                     title: 'Confirmación',
                     message: '¿Está seguro de eliminar la sesión?'
                  }
               });
               confirmDialog.afterClosed().subscribe(result => {
                  if (result === true) {
                     this.sesionService.delete(ses).subscribe({
                        next: (response) => {
                           if (response > 0) {
                              this.toastr.success('La sesión ha sido eliminada exitosamente', 'Transacción exitosa');
                              this.sesionService.setIsUpdated(true);
                           } else {
                              this.toastr.warning('No es posible eliminar la sesión ya que tiene información relacionada', 'Precaución');
                           }
                        },
                        error: (err) => {
                           if (err.status === 409) { // Suponiendo que el código de estado HTTP es 409 (conflicto)
                              this.toastr.warning(
                                 'Esta sesión cuenta con archivos.',
                                 'Conflicto'
                              );
                           } else {
                              this.toastr.error('Ha ocurrido un error', 'Error');
                           }
                        }
                     });
                  }
               });
            },
         }
      ];
   }


   dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      if (isSameMonth(date, this.viewDate)) {
         if (
            (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
            events.length === 0
         ) {
            this.activeDayIsOpen = false;
         } else {
            this.activeDayIsOpen = true;
         }
         this.viewDate = date;
      }
   }


   deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter((event) => event !== eventToDelete);
   }


   displayFn(emp: Emprendedor): string {
      return emp && emp.empRazonSocial ? emp.empRazonSocial : '';
   }


   eventTimesChanged({
      event,
      newStart,
      newEnd,
   }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map((iEvent) => {
         if (iEvent === event) {
            return {
               ...event,
               start: newStart,
               end: newEnd,
            };
         }
         return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
   }


   handleEvent(action: string, event: CalendarEvent): void {
      let ses: Sesion = this.sesModel.find(f => f.sesId == event.id)!;
      this.attendSesion(ses);
   }


   generateReport() {

   }


   linkListToPaginator() {
      merge(this.paginator.page).pipe(
         startWith({}),
         switchMap(() => {
            // creates an observable of sample data
            console.log('Sesiones pendientes: ', this.sesModeloPendiente);
            return of(this.sesModeloPendiente);
         }))
         .subscribe(res => {
            const from = this.paginator.pageIndex * 5;
            const to = from + 5;
            this.sesPendientes = res.slice(from, to);
         });
   }


   save(ses: Sesion) {
      this.sesionService.save(ses).subscribe({
         next: result => {
            if (Number(result) > 0) {
               this.toastr.success('La sesión ha sido guardada exitosamente', 'Transacción exitosa');
               // this.eventService.setIsUpdated(true);
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }


   search() {
      this.events = [];

      this.sesFilter.sesTisId = this.tisId.toString();
      this.sesFilter.sesFechaIni = startOfYear(this.viewDate).toJSON();
      this.sesFilter.sesFechaFin = endOfYear(this.viewDate).toJSON();
      this.sesFilter.sesEmpId = this.emp && this.emp.empId ? this.emp.empId.toString() : '0';

      this.sesionService.findByRange(this.sesFilter).subscribe({
         next: sess => {

            this.sesModel = sess;
            console.log('Arrar de sesiones: ', this.sesModel);//this.sesTisNombre
            sess.forEach((item, index, array) => {
               this.addEvent(item);
               if (index + 1 === array.length) {
                  //this.loadingService.updateIsLoading(false); 
               }
               /*if(this.viewDate>new Date(item.eveFechaFin)){
                  this.taskData.push( {id: item.eveId, name: (item.eveFechaFin + ' ').replace('T',' ') + item.eveNombre, completed: false, type:'program' });
               }*/
            });
         },
         error: error => {
            //this.loadingService.updateIsLoading(false);
            alert(error.message);
         }
      });
      this.sesionService.findByRangeSesion(this.sesFilter).subscribe({
         next: sess => {

            this.sesModel = sess;
            console.log('SesModel', this.sesModel);
            if (sess)
               this.sesModeloPendiente = sess;//.filter(f => new Date(f.sesHoraFin) < new Date())

            this.linkListToPaginator();
         },
         error: error => {
            alert(error.message);
         }
      });
   }


   selectEmprendedor(sesion: any) {
      if (sesion.option) {
         this.emp = sesion.option.value;
         console.log('Emprendedor seleccionado en calendario: ', this.emp.empId);
         this.search();
      }
   }


   setView(view: CalendarView) {
      this.view = view;
   }
}
