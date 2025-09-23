import { ProductoProveedor } from './producto-proveedor';
import { ProductoProveedorFilter } from './producto-proveedor-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoProveedorService extends GeneralService {
   productoProveedorList: ProductoProveedor[] = [];
   api = this.sUrl + 'ProductosProveedores';

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

   delete(entity: ProductoProveedor): Observable<ProductoProveedor> {
      let params = new HttpParams();
      let url = '';
      if (entity.prvProId) {
         url = `${this.api}/${entity.prvProId.toString()}/${entity.prvPveId.toString()}`;         
         return this.http.delete<ProductoProveedor>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: ProductoProveedorFilter): Observable<ProductoProveedor[]> {
      const url = `${this.api}/${filter.prvProId}/${filter.prvPveId}/${filter.prvUnmId}`;
      return this.http.get<ProductoProveedor[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<ProductoProveedor> {
      const url = `${this.api}/${id}`;
      const params = { prvProId: id };
      return this.http.get<ProductoProveedor[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ProductoProveedorFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.productoProveedorList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: ProductoProveedor): Observable<ProductoProveedor> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
   
      return this.http.post<ProductoProveedor>(url, entity, { headers });
 
         if (entity.prvProId) {
         return this.http.put<ProductoProveedor>(url, entity, { headers });
      } else {
         return this.http.post<ProductoProveedor>(url, entity, { headers });
      }
   }
}