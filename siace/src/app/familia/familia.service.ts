import { Familia } from './familia';
import { FamiliaFilter } from './familia-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class FamiliaService extends GeneralService {
   familiaList: Familia[] = [];
   api = this.sUrl + 'Familias';

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

   delete(entity: Familia): Observable<Familia> {
      let params = new HttpParams();
      let url = '';
      if (entity.famId) {
         url = `${this.api}/${entity.famId.toString()}`;
         params = new HttpParams().set('ID', entity.famId.toString());
         return this.http.delete<Familia>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
   find(filter: FamiliaFilter): Observable<Familia[]> {
      const url = `${this.api}/${filter.famId}/${filter.famSmaId}/${filter.famIdParent}`;
      return this.http.get<Familia[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<Familia> {
      const url = `${this.api}/${id}`;
      const params = { famId: id };
      return this.http.get<Familia[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: FamiliaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.familiaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Familia): Observable<Familia> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.famId) {
         return this.http.put<Familia>(url, entity, { headers });
      } else {
         return this.http.post<Familia>(url, entity, { headers });
      }
   }
}