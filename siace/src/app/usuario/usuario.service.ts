import { Usuario } from './usuario';
import { UsuarioFilter } from './usuario-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class UsuarioService extends GeneralService {
   usuarioList: Usuario[] = [];
   api = this.sUrl + 'Usuarios';

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

   delete(entity: Usuario): Observable<Usuario> {
      let params = new HttpParams();
      let url = '';
      if (entity.usuId) {
         url = `${this.api}/${entity.usuId.toString()}`;
         params = new HttpParams().set('ID', entity.usuId.toString());
         return this.http.delete<Usuario>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: UsuarioFilter): Observable<Usuario[]> {
      const url = `${this.api}/${filter.usuId}/${filter.usuPerId}/${filter.usuSucId}/${filter.usuActivo}`;

      return this.http.get<Usuario[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   
   findById(id: string): Observable<Usuario> {
      const url = `${this.api}/${id}`;
      const params = { usuId: id };
      return this.http.get<Usuario[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: UsuarioFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.usuarioList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: Usuario): Observable<Usuario> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
      
      if (entity.usuId) {
         return this.http.put<Usuario>(url, entity, { headers });
      } else {
         return this.http.post<Usuario>(url, entity, { headers });
      }
   }
}