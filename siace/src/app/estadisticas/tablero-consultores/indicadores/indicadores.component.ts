import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TableroConsultoresComunicacionService,
} from '../tablero-consultores-comunicacion.service';


@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit, OnDestroy {
  indicador_Diagnostico = 0;
  indicador_Entrevistas = 0;
  indicador_Derivacion = 0;
  indicador_A3 = 0;

  private destroy$ = new Subject<void>();

  // Mapa para los nombres específicos de cada card
  private mapCardNames: { [key: string]: string } = {
    'diagnostico-card': 'Diagnósticos totales',
    'entrevistas-card': 'Entrevistas totales',
    'devifaci-card': 'Sesiones DEVIFACI totales',
    'a3-card': 'Empresas totales A3'
  };

  constructor(
    private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService,
  ) { }

  ngOnInit(): void {
    this.tableroConsultoresComunicacionService.indicador_Diagnostico$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => this.indicador_Diagnostico = value);

    this.tableroConsultoresComunicacionService.indicador_Entrevistas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => this.indicador_Entrevistas = value);

    this.tableroConsultoresComunicacionService.indicador_Devifaci$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => this.indicador_Derivacion = value);

    this.tableroConsultoresComunicacionService.indicador_A3$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => this.indicador_A3 = value);
  }

  openDialog(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const cardId = target.id; // Obtén el id del mat-card

    // Obtén el nombre específico del mapa usando el id
    let cardName = this.mapCardNames[cardId] || 'Elemento desconocido';

    // Envía el nombre específico en lugar del id
    this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
      titleGraphic: cardName,
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
