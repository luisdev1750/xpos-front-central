import { TipoSesion } from './tipo-sesion';
import { TipoSesionFilter } from './tipo-sesion-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class TipoSesionService extends GeneralService {
   tipoSesionList: TipoSesion[] = [];
   api = this.sUrl + 'TiposSesiones';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: TipoSesion): Observable<TipoSesion> {
      let params = new HttpParams();
      let url = '';
      if (entity.tisId) {
         url = `${this.api}/${entity.tisId.toString()}/${this.user.userid}`;

   
         return this.http.delete<TipoSesion>(url, {headers, params});
      }
      return EMPTY;
   }
  
   findAll(): Observable<TipoSesion[]> {
      const url = `${this.api}`;

      return this.http.get<TipoSesion[]>(url, {headers: headers});
   }


   findByEmp(empId: number): Observable<TipoSesion[]> {
      const url = `${this.api}/listarTipoSesiones/${empId}`;

      return this.http.get<TipoSesion[]>(url, {headers: headers});
   }

  
   find(filter: TipoSesionFilter): Observable<TipoSesion[]> {
      const url = `${this.api}/${filter.tisId}`;

      return this.http.get<TipoSesion[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<TipoSesion> {
      const url = `${this.api}/${id}`;
      const params = { tisId: id };
      return this.http.get<TipoSesion[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(): Observable<TipoSesion[]> {
      return this.findAll().pipe(
         tap(result => {
            this.tipoSesionList = result; // Asignamos los datos a tipoSesionList
         }),
         catchError(err => {
            console.error('Error cargando tipos de sesión', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }
   

  
   save(entity: TipoSesion): Observable<TipoSesion> {
      let url = `${this.api}/${this.user.userid}`;
      if (entity.tisId) {
         return this.http.put<TipoSesion>(url, entity, {headers:headers});
      } else {
         return this.http.post<TipoSesion>(url, entity, {headers:headers});
      }
   }

}

