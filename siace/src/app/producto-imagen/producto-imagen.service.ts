import { ProductoImagen } from './producto-imagen';
import { ProductoImagenFilter } from './producto-imagen-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoImagenService extends GeneralService {
   productoImagenList: ProductoImagen[] = [];
   api = this.sUrl + 'ProductosImagenes';

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

   delete(entity: ProductoImagen): Observable<ProductoImagen> {
      let params = new HttpParams();
      let url = '';
      if (entity.priId) {
         url = `${this.api}/${entity.priId.toString()}`;
         params = new HttpParams().set('ID', entity.priId.toString());
         return this.http.delete<ProductoImagen>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: ProductoImagenFilter): Observable<ProductoImagen[]> {
      const url = `${this.api}/${filter.priId}/${filter.priTimId}`;
      return this.http.get<ProductoImagen[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<ProductoImagen> {
      const url = `${this.api}/${id}`;
      const params = { priId: id };
      return this.http.get<ProductoImagen[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   findByWord(word: string): Observable<any[]> {
      const url = `${this.api}/search-images?q=${word}`;
      return this.http.get<any[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }

   findTipoImagenes(): Observable<any[]> {
      const url = `${this.api}/tipos-imagenes`;
      return this.http.get<any[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
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
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.priId) {
         return this.http.put<ProductoImagen>(url, entity, { headers });
      } else {
         return this.http.post<ProductoImagen>(url, entity, { headers });
      }
   }
}