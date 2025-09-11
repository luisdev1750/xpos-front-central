import { Version } from './version';
import { VersionFilter } from './version-filter';
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
export class VersionService extends GeneralService {
   versionList: Version[] = [];
   api = this.sUrl + 'Versiones';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: Version): Observable<Version> {
      let params = new HttpParams();
      let url = '';
      if (entity.veaId) {
         url = `${this.api}/eliminarVersion/${entity.veaId.toString()}/${this.user.userid}`;
         params = new HttpParams().set('veaId', entity.veaId.toString());
         return this.http.delete<Version>(url, {headers});
      }
      return EMPTY;
   }
  
  
   find(filter: VersionFilter): Observable<Version[]> {
      // const url = `${this.api}/${filter.veaId}`;
      const url = `${this.api}/listarVersiones`;

      return this.http.get<Version[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Version> {
      const url = `${this.api}/${id}`;
      const params = { veaId: id };
      return this.http.get<Version[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: VersionFilter): Observable<Version[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.versionList = result; // Asignamos los datos a versionList
         }),
         catchError(err => {
            console.error('Error cargando versiones', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

  
   save(entity: Version): Observable<Version> {
      let url = `${this.api}/crearVersion/${this.user.userid}`;
      let url1 = `${this.api}/editarVersion/${entity.veaId}/${entity.veaFecha}/${entity.veaNoVersion}/${entity.veaActivo}/${this.user.userid}`;
      if (entity.veaId) {
         return this.http.put<Version>(url1, entity, {headers:headers});
      } else {
         return this.http.post<Version>(url, entity, {headers:headers});
      }
   }

   clone(entity: Version): Observable<Version> {
      const url = `${this.api}/clonarVersion/${entity.veaId}`;
      return this.http.post<Version>(url, entity, {headers: headers});
   }

}

