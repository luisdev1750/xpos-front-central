import { PromocionObsequio } from './promocion-obsequio';
import { PromocionObsequioFilter } from './promocion-obsequio-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PromocionObsequioService extends GeneralService {
   promocionObsequioList: PromocionObsequio[] = [];
   api = this.sUrl + 'PromocionesObsequios';

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

   delete(entity: PromocionObsequio): Observable<PromocionObsequio> {
      let params = new HttpParams();
      let url = '';
      console.log("borrando");
         console.log(entity);
         
       if (entity.pobId) {
         url = `${this.api}/${entity.pobId.toString()}/${entity.pobPmoSucId.toString()}`;

         return this.http.delete<PromocionObsequio>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: PromocionObsequioFilter): Observable<PromocionObsequio[]> {
      const url = `${this.api}/${filter.pobId}/${filter.pobPmoId}`;
      return this.http.get<PromocionObsequio[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<PromocionObsequio> {
      const url = `${this.api}/${id}`;
      const params = { pobId: id };
      return this.http.get<PromocionObsequio[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: PromocionObsequioFilter): void {
      this.find(filter).subscribe({
         next: result => {
            console.log("lista");
            console.log(result);
            
            
            this.promocionObsequioList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: PromocionObsequio): Observable<PromocionObsequio> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.pobId) {
         return this.http.put<PromocionObsequio>(url, entity, { headers });
      } else {
         return this.http.post<PromocionObsequio>(url, entity, { headers });
      }
   }
}