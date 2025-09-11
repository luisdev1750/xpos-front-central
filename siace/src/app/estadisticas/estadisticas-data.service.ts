import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
} from 'rxjs';
import { GeneralService } from '../common/general.service';
import { ClasificacionRequestDTO } from '../dto/ClasificacionRequestDTO';
import {
  ActividadEstadisticaAgrupadaDto,
  DiagnosticoPromedio,
  EmprendedoresSesionDto,
  NumeroEmprendedoresPorNivelDto,
  PilarNivelCompletadoDTO,
  ResultadoDTO,
  SumaPilarDto,
  TableMatDialogData,
  TiposSesionesDto,
} from '../dto/dtoBusiness';


@Injectable()
export class EstadisticasDataService extends GeneralService {
   baseUrl = this.sUrl + 'Estadisticas';
   isNext = new Subject<boolean>();

   constructor(private http: HttpClient) {
      super();
    }

   //better
   contarEmprendedoresConYSinSesionPorRangoDeFechas(tipoSesionId: number, fechaInicio: string, fechaFin: string): Observable<EmprendedoresSesionDto> {
      return this.http.get<EmprendedoresSesionDto>(`${this.baseUrl}/emprendoresAgendados-y-no-por-fechas-y-emprendedor`, { params: { tipoSesionId, fechaInicio, fechaFin } });
   }

   //better
   getDiagnosticoPromedioPorRangoDeFechas(fechaInicio: string, fechaFin: string): Observable<DiagnosticoPromedio[]> {
      return this.http.get<DiagnosticoPromedio[]>(`${this.baseUrl}/diagnostico-promedio-por-fechas`, { params: { fechaInicio, fechaFin } });
   }  


   getDiagnosticoPromedioPorRangoDeFechasYEmprendedor(empId: number, fechaInicio: string, fechaFin: string): Observable<DiagnosticoPromedio[]> {
      return this.http.get<DiagnosticoPromedio[]>(`${this.baseUrl}/diagnostico-promedio-por-fechas-y-emprendedor`, { params: { empId, fechaInicio, fechaFin } });
   }

      numeroEmprendedoresPorNivel(fechaInicio: string, fechaFin: string): Observable<NumeroEmprendedoresPorNivelDto[]> {
         return this.http.get<NumeroEmprendedoresPorNivelDto[]>(`${this.baseUrl}/numero-emprendedores-por-nivel`,{ params: { fechaInicio, fechaFin } });
      }
   


   //-------------------------------------Nuevos-end


   // Método existente para obtener porcentaje de actividades completadas por emprendedor
   getPorcentajeActividadesCompletadasPorEmprendedor(emprendedorId: number): Observable<ActividadEstadisticaAgrupadaDto[]> {
      return this.http.get<ActividadEstadisticaAgrupadaDto[]>(`${this.baseUrl}/porcentaje-actividades-completadas/${emprendedorId}`);
   }

   // Método existente para obtener porcentaje de actividades completadas para todos
   getPorcentajeActividadesCompletadasParaTodos(): Observable<ActividadEstadisticaAgrupadaDto[]> {
      return this.http.get<ActividadEstadisticaAgrupadaDto[]>(`${this.baseUrl}/porcentaje-actividades-completadas-todos`);
   }

   // Método existente para obtener el porcentaje total completado por emprendedor
   getPorcentajeTotalCompletadoPorEmprendedor(emprendedorId: number): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/porcentaje-total-completado/${emprendedorId}`);

   }




   
   numeroTiposSesionesPorTodosEmprendedoresConFechas(fechaInicio: string, fechaFin: string): Observable<TiposSesionesDto[]> {
      return this.http.get<TiposSesionesDto[]>(`${this.baseUrl}/numero-tipos-sesiones-por-fechas`, {
         params: { fechaInicio, fechaFin }
      });
   }


   //Nuevos-end-------------------------------------

   // Método existente para puntaje general filtrado por fechas
   getPuntajeGeneralForAll(startDate: string, endDate: string): Observable<ResultadoDTO[]> {
      return this.http.get<ResultadoDTO[]>(`${this.baseUrl}/puntaje-general-for-all`, { params: { startDate, endDate } });
   }

   // Método existente para obtener la suma de los pilares por contestación
   getSumaDePilar(contestacionId: number): Observable<SumaPilarDto[]> {
      return this.http.get<SumaPilarDto[]>(`${this.baseUrl}/ContestacionSuma/${contestacionId}`);
   }

   //better
   getDataTableDiagnostico(request: ClasificacionRequestDTO): Observable<TableMatDialogData[]> {
      let params = new HttpParams();
  
      // Suponiendo que request tiene propiedades que deseas enviar como parámetros
      Object.keys(request).forEach(key => {
        const value = (request as any)[key]; // Acceder al valor de la propiedad
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
      return this.http.get<TableMatDialogData[]>(`${this.baseUrl}/diagnostico-table`, { params });
   }

   //better
   MatDialog_table_complete_entrevistas(request: ClasificacionRequestDTO):Observable<TableMatDialogData[]>{
      let params = new HttpParams();
  
      Object.keys(request).forEach(key => {
        const value = (request as any)[key]; 
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
  
      return this.http.get<TableMatDialogData[]>(`${this.baseUrl}/entrevista-table`, { params });
   }

   MatDialog_table_complete_sesiones(request: ClasificacionRequestDTO):Observable<TableMatDialogData[]>{
      // Crear HttpParams a partir del objeto request
      let params = new HttpParams();
  
      // Suponiendo que request tiene propiedades que deseas enviar como parámetros
      Object.keys(request).forEach(key => {
        const value = (request as any)[key]; // Acceder al valor de la propiedad
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
  
      // Llamar al API con los parámetros construidos
      return this.http.get<TableMatDialogData[]>(`${this.baseUrl}/sesiones-table`, { params });
   }

   MatDialog_table_complete_niveles(request: ClasificacionRequestDTO):Observable<TableMatDialogData[]>{
      // Crear HttpParams a partir del objeto request
      let params = new HttpParams();
  
      // Suponiendo que request tiene propiedades que deseas enviar como parámetros
      Object.keys(request).forEach(key => {
        const value = (request as any)[key]; // Acceder al valor de la propiedad
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
  
      // Llamar al API con los parámetros construidos
      return this.http.get<TableMatDialogData[]>(`${this.baseUrl}/niveles-table`, { params });
   }



   PorcentajeCompletado_agrupado_pilar_nivel_por_emprendedor (empId:number):Observable<PilarNivelCompletadoDTO[]>{
      return this.http.get<PilarNivelCompletadoDTO[]>(`${this.baseUrl}/porcentajeCompletado_agrupado_pilar_nivel_por_emprendedor`, { params: { empId } });
   }

   getEmpIdByUserId(usrId:number):Observable<number>{
      return this.http.get<number>(`${this.baseUrl}/getEmpIdByUserId`, { params: { usrId } });
   }
}
