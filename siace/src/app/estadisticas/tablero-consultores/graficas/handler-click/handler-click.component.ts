import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ClasificacionRequestDTO,
} from '../../../../dto/ClasificacionRequestDTO';
import { TableMatDialogData } from '../../../../dto/dtoBusiness';
import { TipoSesionService } from '../../../../tipo-sesion/tipo-sesion.service';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';
import { ClickGraphicData } from './clickGraphicData.interface';
import {
  TableMatDialogComponent,
} from './table-mat-dialog/table-mat-dialog.component';


@Component({
  selector: 'app-handler-click',
  templateUrl: './handler-click.component.html',
  styleUrls: ['./handler-click.component.css']
})
export class HandlerClickComponent implements OnInit, OnDestroy {

  sesionesNombre: string[] = [];

  @Input() idClickElement: string = '';

  constructor(
    private dialog: MatDialog,
    private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService,
    private estadisticasDataService: EstadisticasDataService,
    private tipoSesionService: TipoSesionService
  ) { 
    this.tipoSesionService.findAll().subscribe((data) => {
      this.sesionesNombre = data.map((sesion) => sesion.tisNombre);
    });
  }

  ngOnInit(): void {


    this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
      titleGraphic: '',
      titleCategory: ''
    })

    this.tableroConsultoresComunicacionService.clickEventGraphicData.subscribe((data) => {
      if (data.titleGraphic !== '' && this.tableroConsultoresComunicacionService.isTableroStart) {

        this.handleIdChange(data);
      }
    });
  }

  ngOnDestroy(): void {
    //this.tableroConsultoresComunicacionService.clickEventGraphicData.
  }


  async handleIdChange(eventoClick: ClickGraphicData): Promise<void> {
    let valores = this.tableroConsultoresComunicacionService.buscadorDataSubject.value
    let dataTable: TableMatDialogData[] | undefined;

    let requestClasificacion: ClasificacionRequestDTO = {
      categoria: eventoClick.titleCategory,
      FechaInicioStr: valores.fechaIni,
      FechaFinStr: valores.fechaFin
    }

    switch (eventoClick.titleGraphic) {
      // Indicadores
      case 'Diagnósticos totales':
      case 'Diagnóstico Promedio':
        dataTable = await this.estadisticasDataService.getDataTableDiagnostico(requestClasificacion).toPromise();
        break;

      case 'Entrevistas totales':
      case 'Entrevistas':
        dataTable = await this.estadisticasDataService.MatDialog_table_complete_entrevistas(requestClasificacion).toPromise();
        break;

      case 'Sesiones DEVIFACI totales':
      case 'Número de Sesiones':
        dataTable = await this.estadisticasDataService.MatDialog_table_complete_sesiones(requestClasificacion).toPromise();
        // Lógica específica para "Sesiones DEVIFACI totales"
        break;

      case 'Empresas totales A3':
      case 'Empresas por Nivel':
        dataTable = await this.estadisticasDataService.MatDialog_table_complete_niveles(requestClasificacion).toPromise()
        break;
    }



    console.error(dataTable);
    const dialogId = 'unique-dialog-id';

    if (!this.dialog.getDialogById(dialogId)) {
      this.dialog.open(TableMatDialogComponent, {
        id: dialogId,  // Asignar un ID único al diálogo
        data: {
          title: eventoClick.titleGraphic,
          content: dataTable,
          headers: this.sesionesNombre,
        },
        minWidth: '90vw'
      });
    }
  }

}
