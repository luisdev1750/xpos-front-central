import { MenuPerfil } from './menu-perfil';
import { MenuPerfilFilter } from './menu-perfil-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class MenuPerfilService extends GeneralService {
   menuPerfilList: MenuPerfil[] = [];
   api = this.sUrl + 'MenuPerfiles';

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

   delete(entity: MenuPerfil): Observable<any> {
      let params = new HttpParams();
      let url = '';
      if (entity.mepPerId) {
         url = `${this.api}/${entity.mepPerId.toString()}/${entity.mepMenId.toString()}`;
         // params = new HttpParams().set('ID', entity.mepPerId.toString());
         return this.http.delete<any>(url, {
            headers: this.getHeaders(), 
            params
         });
      }
      return EMPTY;
   }
  
  
   find(filter: MenuPerfilFilter): Observable<MenuPerfil[]> {
      const url = `${this.api}/${filter.mepPerId}/${filter.mepMenId}/${filter.mepAppId}`;
      return this.http.get<MenuPerfil[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findMenusExcluidos(perId: string): Observable<MenuPerfil[]> {
      const url = `${this.api}/no-asignados/${perId}`;
      return this.http.get<MenuPerfil[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      });
   }
   
   findById(id: string): Observable<MenuPerfil> {
      const url = `${this.api}/${id}`;
      const params = { mepPerId: id };
      return this.http.get<MenuPerfil[]>(url, {
         headers: this.getHeaders()  // Usar headers con token
      }).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: MenuPerfilFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.menuPerfilList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: MenuPerfil): Observable<MenuPerfil> {
      let url = `${this.api}`;
      const headers = this.getHeaders();  // Obtener headers con token
         return this.http.post<MenuPerfil>(url, entity, { headers });
      if (entity.mepPerId) {
         return this.http.put<MenuPerfil>(url, entity, { headers });
      } else {
         return this.http.post<MenuPerfil>(url, entity, { headers });
      }
   }
}