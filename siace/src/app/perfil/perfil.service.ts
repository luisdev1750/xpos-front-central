import { Perfil } from './perfil';
import { PerfilFilter } from './perfil-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PerfilService extends GeneralService {
   perfilList: Perfil[] = [];
   api = this.sUrl + 'Perfiles';

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

   delete(entity: Perfil): Observable<Perfil> {
      let params = new HttpParams();
      let url = '';
      if (entity.perId) {
         url = `${this.api}/${entity.perId.toString()}`;
         params = new HttpParams().set('ID', entity.perId.toString());
         return this.http.delete<Perfil>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: PerfilFilter): Observable<Perfil[]> {
      const url = `${this.api}/${filter.perId}/${filter.perActivo}/all`;

      return this.http.get<Perfil[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<Perfil> {
      const url = `${this.api}/${id}`;
      const params = { perId: id };
      return this.http.get<Perfil[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: PerfilFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.perfilList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: Perfil): Observable<Perfil> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.perId) {
         return this.http.put<Perfil>(url, entity, { headers });
      } else {
         return this.http.post<Perfil>(url, entity, { headers });
      }
   }
}