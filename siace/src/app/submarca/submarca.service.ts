import { Submarca } from './submarca';
import { SubmarcaFilter } from './submarca-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SubmarcaService extends GeneralService {
   submarcaList: Submarca[] = [];
   api = this.sUrl + 'Submarcas';

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

   delete(entity: Submarca): Observable<Submarca> {
      let params = new HttpParams();
      let url = '';
      if (entity.smaId) {
         url = `${this.api}/${entity.smaId.toString()}`;
         params = new HttpParams().set('ID', entity.smaId.toString());
         return this.http.delete<Submarca>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  

// Opción 1: Modificar el método actual
find(filter: SubmarcaFilter): Observable<Submarca[]> {
  const smaId = filter.smaId || 0;
  const smaMarId = filter.smaMarId || 0;
  
  let url = `${this.api}/${smaId}/${smaMarId}/${filter.smaActivo}`;
  

  
  return this.http.get<Submarca[]>(url, {
    headers: this.getHeaders()
  });
}

   
   findById(id: string): Observable<Submarca> {
      const url = `${this.api}/${id}`;
      const params = { smaId: id };
      return this.http.get<Submarca[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: SubmarcaFilter): void {
      
      this.find(filter).subscribe({
         next: result => {
            this.submarcaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Submarca): Observable<Submarca> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.smaId) {
         return this.http.put<Submarca>(url, entity, { headers });
      } else {
         return this.http.post<Submarca>(url, entity, { headers });
      }
   }
}