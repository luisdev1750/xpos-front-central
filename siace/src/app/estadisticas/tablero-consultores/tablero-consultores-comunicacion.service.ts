import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BuscadoresData } from './buscadores/buscadoresData.interface';
import {
  ClickGraphicData,
} from './graficas/handler-click/clickGraphicData.interface';


@Injectable()
export class TableroConsultoresComunicacionService {

  constructor(
  ) {
  }

  public isTableroStart = false;
  public isUniqueTable = true;

  public buscadorDataSubject = new BehaviorSubject<BuscadoresData>({
    fechaIni: '',
    fechaFin: '',
  });


  public buscadorData$ = this.buscadorDataSubject.asObservable();

  public indicador_DiagnosticoSubject = new BehaviorSubject<number>(0);
  public indicador_Diagnostico$ = this.indicador_DiagnosticoSubject.asObservable();

  public indicador_EntrevistasSubject = new BehaviorSubject<number>(0);
  public indicador_Entrevistas$ = this.indicador_EntrevistasSubject.asObservable();

  public indicador_DevifaciSubject = new BehaviorSubject<number>(0);
  public indicador_Devifaci$ = this.indicador_DevifaciSubject.asObservable();

  public indicador_A3Subject = new BehaviorSubject<number>(0);
  public indicador_A3$ = this.indicador_A3Subject.asObservable();


  public handlerClick_Subject = new BehaviorSubject<string>("");


  public clickEventGraphicData$ = new BehaviorSubject<ClickGraphicData>({
    titleGraphic: '',
    titleCategory: ''
  });

  public clickEventGraphicData = this.clickEventGraphicData$.asObservable();
  public handlerClick$ = this.handlerClick_Subject.asObservable();
}
