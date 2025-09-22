import { ProductoProveedor } from './producto-proveedor';
import { ProductoProveedorFilter } from './producto-proveedor-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ProductoProveedorService extends GeneralService {
   productoProveedorList: ProductoProveedor[] = [];
   api = this.sUrl + 'ProductosProveedores';


   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */

   delete(entity: ProductoProveedor): Observable<ProductoProveedor> {
      let params = new HttpParams();
      let url = '';
      if (entity.prvProId) {
         url = `${this.api}/${entity.prvProId.toString()}`;
         params = new HttpParams().set('ID', entity.prvProId.toString());
         return this.http.delete<ProductoProveedor>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ProductoProveedorFilter): Observable<ProductoProveedor[]> {
      const url = `${this.api}/${filter.prvProId}/${filter.prvPveId}/${filter.prvUnmId}`;

      return this.http.get<ProductoProveedor[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<ProductoProveedor> {
      const url = `${this.api}/${id}`;
      const params = { prvProId: id };
      return this.http.get<ProductoProveedor[]>(url, {headers: headers}).pipe(
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
      if (entity.prvProId) {
         return this.http.put<ProductoProveedor>(url, entity, {headers:headers});
      } else {
         return this.http.post<ProductoProveedor>(url, entity, {headers:headers});
      }
   }

}

