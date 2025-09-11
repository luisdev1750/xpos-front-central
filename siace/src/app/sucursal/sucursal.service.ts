import { Sucursal } from './sucursal';
import { SucursalFilter } from './sucursal-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SucursalService extends GeneralService {
   sucursalList: Sucursal[] = [];
   api = this.sUrl + 'Sucursales';

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

   delete(entity: Sucursal): Observable<Sucursal> {
      let params = new HttpParams();
      let url = '';
      if (entity.sucId) {
         url = `${this.api}/${entity.sucId.toString()}`;
         params = new HttpParams().set('ID', entity.sucId.toString());
         return this.http.delete<Sucursal>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }

   findAll(): Observable<Sucursal[]> {
      const url = `${this.api}/listar`;
      return this.http.get<Sucursal[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
  
   find(filter: SucursalFilter): Observable<Sucursal[]> {
      const url = `${this.api}/${filter.sucId}/${filter.sucCiuId}/${filter.sucColId}/${filter.sucEmpId}`;
      return this.http.get<Sucursal[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<Sucursal> {
      const url = `${this.api}/${id}`;
      const params = { sucId: id };
      return this.http.get<Sucursal[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: SucursalFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.sucursalList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Sucursal): Observable<Sucursal> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.sucId) {
         return this.http.put<Sucursal>(url, entity, { headers });
      } else {
         return this.http.post<Sucursal>(url, entity, { headers });
      }
   }
}