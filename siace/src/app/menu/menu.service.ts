import { Marca } from './menu';
import { MarcaFilter } from './menu-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class MenuService extends GeneralService {
   menuList: Marca[] = [];
   api = this.sUrl + 'Marcas';

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

   delete(entity: Marca): Observable<Marca> {
      let params = new HttpParams();
      let url = '';
      if (entity.marId) {
         url = `${this.api}/${entity.marId.toString()}`;
         params = new HttpParams().set('ID', entity.marId.toString());
         return this.http.delete<Marca>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
   find(filter: MarcaFilter): Observable<Marca[]> {
      const url = `${this.api}/${filter.marId}/${filter.marActivo}`;
      return this.http.get<Marca[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<Marca> {
      const url = `${this.api}/${id}`;
      const params = { marId: id };
      return this.http.get<Marca[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: MarcaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.menuList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Marca): Observable<Marca> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.marId) {
         return this.http.put<Marca>(url, entity, { headers });
      } else {
         return this.http.post<Marca>(url, entity, { headers });
      }
   }
}