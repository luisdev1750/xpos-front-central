import { Necesidad } from './necesidad';
import { NecesidadFilter } from './necesidad-filter';
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
export class NecesidadService extends GeneralService {
   necesidadList: Necesidad[] = [];
   api = this.sUrl + 'Necesidades';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: Necesidad): Observable<Necesidad> {
      let params = new HttpParams();
      let url = '';
      if (entity.necId) {
         url = `${this.api}/${this.user.userid}`;
         console.log("URL final");
         console.log(url);
         console.log("Usuario actual");
         console.log(this.user);
         
         
          // Crear el body con el userId
      const body = { userId: this.user.userid , id: entity.necId};

         // params = new HttpParams().set('ID', entity.necId.toString());
         return this.http.delete<Necesidad>(url, {headers, body});
      }
      return EMPTY;
   }
  
  
   find(filter: NecesidadFilter): Observable<Necesidad[]> {
      const url = `${this.api}`;

      return this.http.get<Necesidad[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Necesidad> {
      const url = `${this.api}/${id}`;
      const params = { necId: id };
      return this.http.get<Necesidad[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: NecesidadFilter): Observable<Necesidad[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.necesidadList = result; // Asignamos los datos a necesidadList
         }),
         catchError(err => {
            console.error('Error cargando necesidades', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }
   
   
   getAll(): Observable<Necesidad[]> {
      return this.http.get<Necesidad[]>(this.api, { headers });
   }

  
   save(entity: Necesidad): Observable<Necesidad> {
      let url = `${this.api}/${this.user.userid ?? 1}`;
      if (entity.necId) {
         return this.http.put<Necesidad>(url, entity, {headers:headers});
      } else {
         return this.http.post<Necesidad>(url, entity, {headers:headers});
      }
   }

}

