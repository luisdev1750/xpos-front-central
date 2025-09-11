import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Nivel } from '../../nivel/nivel';
import { NivelService } from '../../nivel/nivel.service';
import { Pilar } from '../../pilar/pilar';
import { PilarService } from '../../pilar/pilar.service';
import { Actividad } from '../actividad';
import {
  ActividadEditComponent,
} from '../actividad-edit/actividad-edit.component';
import { ActividadFilter } from '../actividad-filter';
import { ActividadService } from '../actividad.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-actividad',
    templateUrl: 'actividad-list.component.html',
    styleUrls: ['actividad-list.component.css']
 })
 export class ActividadListComponent implements OnInit, OnDestroy {
    displayedColumns = ['aaaId', 'pilDescripcion', 'nivDescripcion','aaaDescripcion', 'aaaAaaDescripcion', 'aaaDuracion', 'actions'];
    filter = new ActividadFilter();
    selectedActividad!: Actividad;
 
    private subs!: Subscription;
    pilId!:number;
    pilModel!:Pilar[];
    nivId!: number;
    nivModel!: Nivel[];
 
    dataSource = new MatTableDataSource<any>();
 
    @ViewChild(MatPaginator) paginator!: MatPaginator;
 
 
    @Input('veaId') veaId!: number;
    @Input('veaActivo') veaActivo!: boolean;
    @Input('veaFechaActivacion') veaFechaActivacion!: DateTime;
 
    /* Inicialización */
 
    constructor(
      private actividadService: ActividadService,
       private pilarService: PilarService,
       private nivelService: NivelService,
       private toastr: ToastrService,
       public dialog: MatDialog,
       private paginatoor: MatPaginatorIntl
    ) {
       this.pilId=0;
 
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
       this.subs = this.actividadService.getIsUpdated().subscribe(() => {
          this.search();
       });
 
       //Consulta los pilares
       this.pilarService.findAll().subscribe({
          next:async pils => {
             this.pilModel = pils.sort((a, b) => a.pilDescripcion.localeCompare(b.pilDescripcion));
 
             //Consulta los niveles
             this.nivelService.findAll().subscribe({
                next:async nivs => {
                  this.nivModel = nivs.sort((a, b) => a.nivDescripcion.localeCompare(b.nivDescripcion));
                  if (nivs.length > 0) this.nivId =nivs[0].nivId;
                  this.search();
                },
                error:error => {
                   this.toastr.error('Ha ocurrido un error', 'Error');
                }
             });
          },
          error:error => {
             this.toastr.error('Ha ocurrido un error', 'Error');
          }
       });
    }
 
    
 
 
    ngOnDestroy(): void {
       this.subs?.unsubscribe();
    }
 
 
    /* Accesors */
 
    // get actividadList(): Actividad[] {
    //    return this.actividadService.actividadList;
    // }
 
    get actividadListByVersion(): Actividad[] {
       return this.actividadService.actividadListByVersion;
    }
 
 
    /* Métodos */
 
    add() {
       let newActividad: Actividad = new Actividad();
       newActividad.aaaNivId = this.nivId;
       newActividad.aaaPilId = this.pilId;
       newActividad.aaaVeaId = this.veaId;
       newActividad.aaaEstatus=false;
       this.edit(newActividad);
    }
 
 
    delete(actividad: Actividad): void {
       const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
          data: {
             title: 'Confirmación',
             message: '¿Está seguro de eliminar el actividad?: '
          },
       });
       confirmDialog.afterClosed().subscribe(result => {
          if (result === true) {
 
             this.actividadService.delete(actividad).subscribe(() => {
                this.toastr.success('El actividad ha sido guardado exitosamente', 'Transacción exitosa');
                this.actividadService.setIsUpdated(true);
             },
                err => {
                   this.toastr.error('Ha ocurrido un error', 'Error');
                }
             );
          }
       });
    }
 
 
    edit(ele: Actividad) {
       this.dialog.open(ActividadEditComponent, {
          data: {actividad: JSON.parse(JSON.stringify(ele)), 
             nivModel: this.nivModel, 
             pilModel: this.pilModel, 
             aaaModel: this.actividadListByVersion, 
             veaModel: this.veaId,
             veaFechaActivacion: this.veaFechaActivacion},
             minHeight: '80vh',
             minWidth: '75vw',
       },
    );
    }
 
 
    search(): void {
       this.filter.aaaPilId = this.pilId.toString();
       this.filter.aaaNivId = this.nivId.toString();
       this.filter.aaaVeaId = this.veaId.toString();
       // this.actividadService.loadActividades(this.filter);
 
       this.actividadService.load(this.filter).subscribe(
          data => {
             this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
             this.dataSource.paginator = this.paginator; // Asignamos el paginador
             //this.paginator._changePageSize(this.paginator.pageSize);
             console.log('actividades de paginador: ', this.dataSource.paginator);
          },
          err => {
             console.error('Error al cargar actividades', err);
          }
       );
    }
 
 
    select(selected: Actividad): void {
       this.selectedActividad = selected;
    }
 
 }