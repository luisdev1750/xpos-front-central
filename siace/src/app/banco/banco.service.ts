import { Banco } from './banco';
import { BancoFilter } from './banco-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

// Elimina el headers constante global y crea un método para generar headers con token
@Injectable()
export class BancoService extends GeneralService {
   bancoList: Banco[] = [];
   api = this.sUrl + 'Bancos';

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

   delete(entity: Banco): Observable<Banco> {
      let params = new HttpParams();
      let url = '';
      if (entity.banId) {
         url = `${this.api}/${entity.banId.toString()}`;
         params = new HttpParams().set('ID', entity.banId.toString());
         return this.http.delete<Banco>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
   find(filter: BancoFilter): Observable<Banco[]> {
      const url = `${this.api}/${filter.banId}/${filter.banActivo}`;
      return this.http.get<Banco[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<Banco> {
      const url = `${this.api}/${id}`;
      const params = { banId: id };
      return this.http.get<Banco[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: BancoFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.bancoList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

   save(entity: Banco): Observable<Banco> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.banId) {
         return this.http.put<Banco>(url, entity, { headers });
      } else {
         return this.http.post<Banco>(url, entity, { headers });
      }
   }
}