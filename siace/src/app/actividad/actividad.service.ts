import { Actividad } from './actividad';
import { ActividadFilter } from './actividad-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { catchError, map, tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ActividadService extends GeneralService {
   actividadList: Actividad[] = [];
   actividadListByVersion: Actividad[] = [];
   api = this.sUrl + 'Actividades';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Actividad): Observable<Actividad> {
      let params = new HttpParams();
      let url = '';
      if (entity.aaaId) {
         url = `${this.api}/eliminarActividades?idActividad=${entity.aaaId.toString()}`;
         params = new HttpParams().set('ID', entity.aaaId.toString());
         return this.http.delete<Actividad>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ActividadFilter): Observable<Actividad[]> {
      const pilId=filter.aaaPilId==''?'0': filter.aaaPilId;
      const nivId=filter.aaaNivId==''?'0': filter.aaaNivId;
      const empId=filter.empId==''?'0': filter.empId;
      //const url = `${this.api}/${pilId}/${nivId}`;
      const url = `${this.api}/listarActividades/${empId}/${pilId}/${nivId}`;

      return this.http.get<Actividad[]>(url, {headers: headers});
   }


   findActividades(filter: ActividadFilter): Observable<Actividad[]> {
      const veaId=filter.aaaVeaId==''?'0': filter.aaaVeaId;
      const pilId=filter.aaaPilId==''?'0': filter.aaaPilId;
      const nivId=filter.aaaNivId==''?'0': filter.aaaNivId;
      const url = `${this.api}/${veaId}/${pilId}/${nivId}`;

      return this.http.get<Actividad[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Actividad> {
      const url = `${this.api}/${id}`;
      const params = { aaaId: id };
      return this.http.get<Actividad[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ActividadFilter): Observable<Actividad[]> {
      return this.findActividades(filter).pipe(
         tap(result => {
            this.actividadListByVersion = result;
         }),
         catchError(err => {
            console.error('Error cargando versiones', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

   // loadActividades(filter: ActividadFilter): void {
   //    this.findActividades(filter).subscribe({
   //       next: result => {
   //       this.actividadListByVersion = result;
   //       },
   //       error: err => {
   //          console.error('error cargando', err);
   //          this.actividadListByVersion = err;
   //       }
   //    });
   // }

  
   save(entity: Actividad): Observable<Actividad> {
      let url = `${this.api}`;
      if (entity.aaaId) {
         return this.http.put<Actividad>(url, entity, {headers:headers});
      } else {
         return this.http.post<Actividad>(url, entity, {headers:headers});
      }
   }

}

