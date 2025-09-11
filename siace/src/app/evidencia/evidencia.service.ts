import { Evidencia } from './evidencia';
import { EvidenciaFilter } from './evidencia-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { catchError, map, tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class EvidenciaService extends GeneralService {
   evidenciaList: Evidencia[] = [];
   api = this.sUrl + 'Evidencias';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Evidencia): Observable<Evidencia> {
      let params = new HttpParams();
      let url = '';
      if (entity.eviId) {
         url = `${this.api}/${entity.eviId.toString()}`;
         params = new HttpParams().set('ID', entity.eviId.toString());
         return this.http.delete<Evidencia>(url, {headers});
      }
      return EMPTY;
   }
  
  
   find(filter: EvidenciaFilter): Observable<Evidencia[]> {
      const aaaId=filter.eviAaaId==''?'0':filter.eviAaaId;
      const url = `${this.api}/${aaaId}`;

      return this.http.get<Evidencia[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Evidencia> {
      const url = `${this.api}/${id}`;
      const params = { eviId: id };
      return this.http.get<Evidencia[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: EvidenciaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.evidenciaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }


   loadEvidencia(filter: EvidenciaFilter): Observable<Evidencia[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.evidenciaList = result;
         }),
         catchError(err => {
            console.error('Error cargando versiones', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

  
   save(entity: Evidencia): Observable<Evidencia> {
      let url = `${this.api}`;
      if (entity.eviId) {
         return this.http.put<Evidencia>(url, entity, {headers:headers});
      } else {
         return this.http.post<Evidencia>(url, entity, {headers:headers});
      }
   }

}

