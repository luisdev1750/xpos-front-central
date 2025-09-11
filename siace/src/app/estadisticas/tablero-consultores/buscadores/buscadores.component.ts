import { Component } from '@angular/core';
import {
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { ResultadoDTO } from '../../../dto/dtoBusiness';
import { EstadisticasDataService } from '../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../tablero-consultores-comunicacion.service';
import { BuscadoresData } from './buscadoresData.interface';


@Component({
  selector: 'app-buscadores',
  templateUrl: './buscadores.component.html',
  styleUrls: ['./buscadores.component.css']
})
export class BuscadoresComponent {
  fechaIni: Date | undefined; // Fecha inicial
  fechaFin: Date | undefined; // Fecha final
  isEmpresarioIDActive: boolean = false;

  displayedColumns: string[] = ['conId', 'conNombre', 'conFecha'];
  dataChart: ResultadoDTO[] = [];
  isReadyGraphics = false;

  constructor(
    private toastr: ToastrService,
    private estadisticasDataService: EstadisticasDataService,
    private TableroConsultoresComunicacionService: TableroConsultoresComunicacionService
  ) {
    let today=new Date();
    this.fechaIni=startOfMonth(today);
    this.fechaFin=startOfDay(today);

    this.search();
  }

  /**
   * Función para enviar la información
   */
  search() {
    // Validación básica de las fechas
    if (!this.fechaIni || !this.fechaFin) {
      this.toastr.error('Por favor seleccione ambas fechas', 'Error');
      return;
    }

    // Construir el objeto BuscadoresData utilizando la interfaz
    const buscadorData: BuscadoresData = {
      fechaIni: this.fechaIni.toJSON(),
      fechaFin: this.fechaFin.toJSON(),
    };

    this.TableroConsultoresComunicacionService.buscadorDataSubject.next(buscadorData);
  }

  /**
   * Función para actualizar la gráfica de barras
   */
  toggleGraphics() {
    this.isReadyGraphics = !this.isReadyGraphics;
  }
}
