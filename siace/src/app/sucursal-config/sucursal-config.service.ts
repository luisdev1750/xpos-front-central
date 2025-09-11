import { SucursalConfig } from './sucursal-config';
import { SucursalConfigFilter } from './sucursal-config-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SucursalConfigService extends GeneralService {
   sucursalConfigList: SucursalConfig[] = [];
   api = this.sUrl + 'SucursalesConfig';

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

   delete(entity: SucursalConfig): Observable<SucursalConfig> {
      let params = new HttpParams();
      let url = '';
      if (entity.scoId) {
         url = `${this.api}/${entity.scoId.toString()}`;
         params = new HttpParams().set('ID', entity.scoId.toString());
         return this.http.delete<SucursalConfig>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
   find(filter: SucursalConfigFilter): Observable<SucursalConfig[]> {
      const url = `${this.api}/${filter.scoId}/${filter.scoSucId}`;
      return this.http.get<SucursalConfig[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<SucursalConfig> {
      const url = `${this.api}/${id}`;
      const params = { scoId: id };
      return this.http.get<SucursalConfig[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: SucursalConfigFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.sucursalConfigList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: SucursalConfig): Observable<SucursalConfig> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.scoId) {
         return this.http.put<SucursalConfig>(url, entity, { headers });
      } else {
         return this.http.post<SucursalConfig>(url, entity, { headers });
      }
   }
}