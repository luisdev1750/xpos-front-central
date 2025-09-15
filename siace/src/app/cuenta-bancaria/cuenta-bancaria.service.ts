import { CuentaBancaria } from './cuenta-bancaria';
import { CuentaBancariaFilter } from './cuenta-bancaria-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CuentaBancariaService extends GeneralService {
   cuentaBancariaList: CuentaBancaria[] = [];
   api = this.sUrl + 'CuentasBancarias';

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

   delete(entity: CuentaBancaria): Observable<CuentaBancaria> {
      let params = new HttpParams();
      let url = '';
      if (entity.cubId) {
         url = `${this.api}/${entity.cubId.toString()}`;
         params = new HttpParams().set('ID', entity.cubId.toString());
         return this.http.delete<CuentaBancaria>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: CuentaBancariaFilter): Observable<CuentaBancaria[]> {
      const url = `${this.api}/${filter.cubId}/${filter.cubSucId}/${filter.cubBanId}`;
      return this.http.get<CuentaBancaria[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<CuentaBancaria> {
      const url = `${this.api}/${id}`;
      const params = { cubId: id };
      return this.http.get<CuentaBancaria[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: CuentaBancariaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.cuentaBancariaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: CuentaBancaria): Observable<CuentaBancaria> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.cubId) {
         return this.http.put<CuentaBancaria>(url, entity, { headers });
      } else {
         return this.http.post<CuentaBancaria>(url, entity, { headers });
      }
   }
}