import { ProductoImagen } from './producto-imagen';
import { ProductoImagenFilter } from './producto-imagen-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ProductoImagenService extends GeneralService {
   productoImagenList: ProductoImagen[] = [];
   api = this.sUrl + 'ProductosImagenes';


   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */

   delete(entity: ProductoImagen): Observable<ProductoImagen> {
      let params = new HttpParams();
      let url = '';
      if (entity.priId) {
         url = `${this.api}/${entity.priId.toString()}`;
         params = new HttpParams().set('ID', entity.priId.toString());
         return this.http.delete<ProductoImagen>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ProductoImagenFilter): Observable<ProductoImagen[]> {
      const url = `${this.api}/${filter.priId}/${filter.priProId}/${filter.priTimId}`;

      return this.http.get<ProductoImagen[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<ProductoImagen> {
      const url = `${this.api}/${id}`;
      const params = { priId: id };
      return this.http.get<ProductoImagen[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ProductoImagenFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.productoImagenList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: ProductoImagen): Observable<ProductoImagen> {
      let url = `${this.api}`;
      if (entity.priId) {
         return this.http.put<ProductoImagen>(url, entity, {headers:headers});
      } else {
         return this.http.post<ProductoImagen>(url, entity, {headers:headers});
      }
   }

}

