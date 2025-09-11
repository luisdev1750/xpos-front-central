import { Giro } from './giro';
import { GiroFilter } from './giro-filter';
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
export class GiroService extends GeneralService {
   giroList: Giro[] = [];
   api = this.sUrl + 'Giros';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        
    this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   delete(entity: Giro): Observable<Giro> {
      let params = new HttpParams();
      let url = '';
      if (entity.girId) {
         url = `${this.api}/${entity.girId.toString()}`;
           const body = { userId: this.user.userid ?? 1 , id: entity.girId};
         params = new HttpParams().set('ID', entity.girId.toString());
         return this.http.delete<Giro>(url, {headers, params, body});
      }
      return EMPTY;
   }
  
   // delete(entity: Emprendedor, userId: number): Observable<Emprendedor> {
   //    let url = '';
   //    if (entity.empId) {
   //      url = `${this.api}/${entity.empId.toString()}`;
  
   //      // Crear el body con el userId
   //      const body = { userId: this.user.userid ?? 1 , id: entity.empId};
  
   //      return this.http.delete<Emprendedor>(url, { headers, body });
   //    }
   //    return EMPTY;
   //  }
   find(filter: GiroFilter): Observable<Giro[]> {
      const url = `${this.api}/${filter.girId}`;

      return this.http.get<Giro[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Giro> {
      const url = `${this.api}/${id}`;
      const params = { girId: id };
      return this.http.get<Giro[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: GiroFilter): Observable<Giro[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.giroList = result; // Asignamos los datos a giroList
         }),
         catchError(err => {
            console.error('Error cargando giros', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

  
   save(entity: Giro): Observable<Giro> {
      let url = `${this.api}/${this.user.userid}`;
      if (entity.girId) {
         return this.http.put<Giro>(url, entity, {headers:headers});
      } else {
         return this.http.post<Giro>(url, entity, {headers:headers});
      }
   }

   getAll(): Observable<Giro[]> {
      return this.http.get<Giro[]>(this.api, { headers });
   }


}

