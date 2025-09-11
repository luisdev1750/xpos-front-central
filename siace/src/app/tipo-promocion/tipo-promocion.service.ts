import { TipoPromocion } from './tipo-promocion';
import { TipoPromocionFilter } from './tipo-promocion-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TipoPromocionService extends GeneralService {
   tipoPromocionList: TipoPromocion[] = [];
   api = this.sUrl + 'TiposPromociones';

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

   delete(entity: TipoPromocion): Observable<TipoPromocion> {
      let params = new HttpParams();
      let url = '';
      if (entity.tprId) {
         url = `${this.api}/${entity.tprId.toString()}`;
         params = new HttpParams().set('ID', entity.tprId.toString());
         return this.http.delete<TipoPromocion>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: TipoPromocionFilter): Observable<TipoPromocion[]> {
      const url = `${this.api}/${filter.tprId}/${filter.tprActivo}`;
      return this.http.get<TipoPromocion[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<TipoPromocion> {
      const url = `${this.api}/${id}`;
      const params = { tprId: id };
      return this.http.get<TipoPromocion[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: TipoPromocionFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.tipoPromocionList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: TipoPromocion): Observable<TipoPromocion> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.tprId) {
         return this.http.put<TipoPromocion>(url, entity, { headers });
      } else {
         return this.http.post<TipoPromocion>(url, entity, { headers });
      }
   }
}