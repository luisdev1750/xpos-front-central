import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class ComunicationDashboardService {
  empId=0

  isNewSearch= new Subject<boolean>();

  indicador_diagnosticoEmprendedor=0;

  constructor() { }

  PieEmprendoresComunication(){
    console.log("PieEmprendoresComunication");
  }
}
