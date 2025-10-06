import { Empresa } from './empresa';
import { EmpresaFilter } from './empresa-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class EmpresaService extends GeneralService {
   empresaList: Empresa[] = [];
   api = this.sUrl + 'Empresa';

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

   delete(entity: Empresa): Observable<Empresa> {
      let params = new HttpParams();
      let url = '';
      if (entity.empId) {
         url = `${this.api}/${entity.empId.toString()}`;
         return this.http.delete<Empresa>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }

   findAll(): Observable<Empresa[]> {
      const url = `${this.api}/listar`;
      return this.http.get<Empresa[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }

   find(filter: EmpresaFilter): Observable<Empresa[]> {
      const url = `${this.api}/${filter.empId}`;
      return this.http.get<Empresa[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<Empresa> {
      const url = `${this.api}/${id}`;
      const params = { empId: id };
      return this.http.get<Empresa[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: EmpresaFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.empresaList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Empresa): Observable<Empresa> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.empId) {
         return this.http.put<Empresa>(url, entity, { headers });
      } else {
         return this.http.post<Empresa>(url, entity, { headers });
      }
   }
}