import { Objetivo } from './objetivo';
import { ObjetivoFilter } from './objetivo-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ObjetivoService extends GeneralService {
   objetivoList: Objetivo[] = [];
   api = this.sUrl + 'Objetivos';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Objetivo): Observable<Objetivo> {
      let params = new HttpParams();
      let url = '';
      if (entity.objId) {
         url = `${this.api}/${entity.objId.toString()}`;
         params = new HttpParams().set('ID', entity.objId.toString());
         return this.http.delete<Objetivo>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ObjetivoFilter): Observable<Objetivo[]> {
      const tisId=filter.objTisId==''?'0': filter.objTisId;
      const url = `${this.api}/${tisId}`;

      return this.http.get<Objetivo[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Objetivo> {
      const url = `${this.api}/${id}`;
      const params = { objId: id };
      return this.http.get<Objetivo[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ObjetivoFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.objetivoList = result;
         },
         error:err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: Objetivo): Observable<Objetivo> {
      let url = `${this.api}`;
      if (entity.objId) {
         return this.http.put<Objetivo>(url, entity, {headers:headers});
      } else {
         return this.http.post<Objetivo>(url, entity, {headers:headers});
      }
   }



   findObjetivos(filter: ObjetivoFilter): Observable<Objetivo[]> {
      const sesId=filter.sesId ==''?'0': filter.sesId;
      const url = `${this.api}/listarObjetivo/${sesId}`;

      return this.http.get<Objetivo[]>(url, {headers: headers});
   }

   loadObjetivos(filter: ObjetivoFilter): Observable<Objetivo[]> {
      return this.findObjetivos(filter).pipe(
         tap(result => {
            this.objetivoList = result;
         })
      );
   }


   

}

