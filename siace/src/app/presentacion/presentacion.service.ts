import { Presentacion } from './presentacion';
import { PresentacionFilter } from './presentacion-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PresentacionService extends GeneralService {
   presentacionList: Presentacion[] = [];
   api = this.sUrl + 'Presentaciones';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
      super();
   }

   // Método para obtener headers con el token
   private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('accessToken');
      let headers = new HttpHeaders().set('Accept', 'application/json');
      
      if (token) {
         headers = headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
   }

   /* Métodos */

   delete(entity: Presentacion): Observable<Presentacion> {
      let params = new HttpParams();
      let url = '';
      if (entity.preId) {
         url = `${this.api}/${entity.preId.toString()}`;
         params = new HttpParams().set('ID', entity.preId.toString());
         return this.http.delete<Presentacion>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: PresentacionFilter): Observable<Presentacion[]> {
      const url = `${this.api}/${filter.preId}/${filter.preActivo}`;
      return this.http.get<Presentacion[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<Presentacion> {
      const url = `${this.api}/${id}`;
      const params = { preId: id };
      return this.http.get<Presentacion[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: PresentacionFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.presentacionList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: Presentacion): Observable<Presentacion> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.preId) {
         return this.http.put<Presentacion>(url, entity, { headers });
      } else {
         return this.http.post<Presentacion>(url, entity, { headers });
      }
   }
}