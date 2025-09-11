import { Auditoria } from './auditoria';
import { AuditoriaFilter } from './auditoria-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class AuditoriaService extends GeneralService {
   auditoriaList: Auditoria[] = [];
   api = this.sUrl + 'Auditorias';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Auditoria): Observable<Auditoria> {
      let params = new HttpParams();
      let url = '';
      if (entity.audId) {
         url = `${this.api}/${entity.audId.toString()}`;
         params = new HttpParams().set('ID', entity.audId.toString());
         return this.http.delete<Auditoria>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: AuditoriaFilter): Observable<Auditoria[]> {
      // const url = `${this.api}/${filter.audUsrId}/${filter.audTipo}`;
      const url = `${this.api}/${filter.audFechaInicial.toJSON()}/${filter.audFechaFinal.toJSON()}/${filter.audModulo}/${filter.audUsrId}/${filter.audTipo}`;
      return this.http.get<Auditoria[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Auditoria> {
      const url = `${this.api}/${id}`;
      const params = { audId: id };
      return this.http.get<Auditoria[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: AuditoriaFilter): Observable<Auditoria[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.auditoriaList = result; 
         }),
         catchError(err => {
            console.error('Error cargando', err);
            return of([]); 
         })
      );
   }

  
   save(entity: Auditoria): Observable<Auditoria> {
      let url = `${this.api}`;
      if (entity.audId) {
         return this.http.put<Auditoria>(url, entity, {headers:headers});
      } else {
         return this.http.post<Auditoria>(url, entity, {headers:headers});
      }
   }

}

