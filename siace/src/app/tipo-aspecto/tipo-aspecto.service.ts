import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  tap,
} from 'rxjs/operators';
import { GeneralService } from '../common/general.service';
import { TipoAspecto } from './tipo-aspecto';
import { TipoAspectoFilter } from './tipo-aspecto-filter';

import { ApplicationUser } from '../login/login.service';
const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class TipoAspectoService extends GeneralService {
   tipoAspectoList: TipoAspecto[] = [];
   api = this.sUrl + 'TiposAspectos';

   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        
    this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: TipoAspecto): Observable<TipoAspecto> {
      let params = new HttpParams();
      let url = '';
      if (entity.tiaId) {

         url = `${this.api}/${entity.tiaId.toString()}`;
         
         const body =  { userId: this.user.userid ?? 1 , id: entity.tiaId};

         // params = new HttpParams().set('ID', entity.tiaId.toString());

         return this.http.delete<TipoAspecto>(url, {headers, params, body});

      }
      return EMPTY;
   }
  
  
   findAll(): Observable<TipoAspecto[]> {
      const url = `${this.api}`;
      return this.http.get<TipoAspecto[]>(url, {headers: headers});
   }


   find(filter: TipoAspectoFilter): Observable<TipoAspecto[]> {
      const url = `${this.api}/${filter.tiaId}`;

      return this.http.get<TipoAspecto[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<TipoAspecto> {
      const url = `${this.api}/${id}`;
      const params = { tiaId: id };
      return this.http.get<TipoAspecto[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(): Observable<TipoAspecto[]> {
      return this.findAll().pipe(
         tap(result => {
            console.log('Cargando tipos de aspecto', result);
            this.tipoAspectoList = result; // Asignamos los datos a tipoAspectoList
         }),
         catchError(err => {
            console.error('Error cargando tipos de aspecto', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }
   

  
   save(entity: TipoAspecto): Observable<TipoAspecto> {
      let url = `${this.api}/${this.user.userid}`;
      if (entity.tiaId) {
         return this.http.put<TipoAspecto>(url, entity, {headers:headers});
      } else {
         return this.http.post<TipoAspecto>(url, entity, {headers:headers});
      }
   }

}

