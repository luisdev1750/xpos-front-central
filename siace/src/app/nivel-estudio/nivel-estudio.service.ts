import { NivelEstudio } from './nivel-estudio';
import { NivelEstudioFilter } from './nivel-estudio-filter';
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
export class NivelEstudioService extends GeneralService {
   nivelEstudioList: NivelEstudio[] = [];
   api = this.sUrl + 'NivelesEstudios';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        
    this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: NivelEstudio): Observable<NivelEstudio> {
      let params = new HttpParams();
      let url = '';
      if (entity.nieId) {
         url = `${this.api}/${entity.nieId.toString()}`;
         
      const body =  { userId: this.user.userid ?? 1 , id: entity.nieId};
         params = new HttpParams().set('ID', entity.nieId.toString());
         return this.http.delete<NivelEstudio>(url, {headers, params, body});
      }
      return EMPTY;
   }
  
  
   find(filter: NivelEstudioFilter): Observable<NivelEstudio[]> {
      const url = `${this.api}/${filter.nieId}`;

      return this.http.get<NivelEstudio[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<NivelEstudio> {
      const url = `${this.api}/${id}`;
      const params = { nieId: id };
      return this.http.get<NivelEstudio[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }

   load(filter: NivelEstudioFilter): Observable<NivelEstudio[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.nivelEstudioList = result; // Asignamos los datos a nivelEstudioList
         }),
         catchError(err => {
            console.error('Error cargando niveles de estudio', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }
   

  
   save(entity: NivelEstudio): Observable<NivelEstudio> {
      
      let url = `${this.api}/${this.user.userid}`;
  
      if (entity.nieId) {
         return this.http.put<NivelEstudio>(url, entity, {headers:headers});
      } else {
         return this.http.post<NivelEstudio>(url, entity, {headers:headers});
      }
   }

   getAll(): Observable<NivelEstudio[]> {
      return this.http.get<NivelEstudio[]>(this.api, { headers });
   }

}

