import { ProductoPrecio } from './producto-precio';
import { ProductoPrecioFilter } from './producto-precio-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoPrecioService extends GeneralService {
   productoPrecioList: ProductoPrecio[] = [];
   api = this.sUrl + 'ProductosPrecios';

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

   delete(entity: ProductoPrecio): Observable<ProductoPrecio> {
      let params = new HttpParams();
      let url = '';
      if (entity.prrProId) {
         url = `${this.api}/${entity.prrProId.toString()}/${entity.prrLprId.toString()}`;

         return this.http.delete<ProductoPrecio>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: ProductoPrecioFilter): Observable<ProductoPrecio[]> {
      const url = `${this.api}/${filter.prrProId}/${filter.prrLprId}`;
      return this.http.get<ProductoPrecio[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findListPreciosExclude(proId: number): Observable<any[]> {
      const url = `${this.api}/listaPrecio/${proId}`;
      return this.http.get<any[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }

   findReglaImpuestos(): Observable<any[]> {
      const url = `${this.api}/getReglaImpuestos`;
      return this.http.get<any[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<ProductoPrecio> {
      const url = `${this.api}/${id}`;
      const params = { prrProId: id };
      return this.http.get<ProductoPrecio[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ProductoPrecioFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.productoPrecioList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: ProductoPrecio, isNew?: boolean): Observable<ProductoPrecio> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (!isNew) {
         return this.http.put<ProductoPrecio>(url, entity, { headers });
      } else {
         return this.http.post<ProductoPrecio>(url, entity, { headers });
      }
   }
}