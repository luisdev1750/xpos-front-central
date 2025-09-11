import { TasaCuota } from './tasa-cuota';
import { TasaCuotaFilter } from './tasa-cuota-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TasaCuotaService extends GeneralService {
   tasaCuotaList: TasaCuota[] = [];
   api = this.sUrl + 'TasasOCuotas';

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

   delete(entity: TasaCuota): Observable<TasaCuota> {
      let params = new HttpParams();
      let url = '';
      if (entity.tocId) {
         url = `${this.api}/${entity.tocId.toString()}`;
         params = new HttpParams().set('ID', entity.tocId.toString());
         return this.http.delete<TasaCuota>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: TasaCuotaFilter): Observable<TasaCuota[]> {
      const url = `${this.api}/${filter.tocId}/${filter.tocImpId}/${filter.tocTfaId}/${filter.tocActivo}`;

      return this.http.get<TasaCuota[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }

    findCatalog(catalog: string): Observable<any[]> {
      const url = `${this.api}/${catalog}`;

      return this.http.get<any[]>(url, {
         headers: this.getHeaders()  
      });
   }
   
   
   findById(id: string): Observable<TasaCuota> {
      const url = `${this.api}/${id}`;
      const params = { tocId: id };
      return this.http.get<TasaCuota[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: TasaCuotaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.tasaCuotaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: TasaCuota): Observable<TasaCuota> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.tocId) {
         return this.http.put<TasaCuota>(url, entity, { headers });
      } else {
         return this.http.post<TasaCuota>(url, entity, { headers });
      }
   }
}