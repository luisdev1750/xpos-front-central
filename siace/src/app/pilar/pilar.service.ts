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
import { Pilar } from './pilar';
import { PilarFilter } from './pilar-filter';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class PilarService extends GeneralService {
   pilarList: Pilar[] = [];
   api = this.sUrl + 'Pilares';

   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
             
    this.user = JSON.parse(localStorage.getItem('user')!);
   }



   /* Métodos */
   delete(entity: Pilar): Observable<Pilar> {
      let params = new HttpParams();
      let url = '';
      if (entity.pilId) {
         url = `${this.api}/${entity.pilId.toString()}`;
         const body =  { userId: this.user.userid ?? 1 , id: entity.pilId};
         params = new HttpParams().set('ID', entity.pilId.toString());
         return this.http.delete<Pilar>(url, {headers, params, body});
      }
      return EMPTY;
   }
  

   findAll(): Observable<Pilar[]> {
      const url = `${this.api}/listar`;

      return this.http.get<Pilar[]>(url, {headers: headers});
   }

  
   find(filter: PilarFilter): Observable<Pilar[]> {
      const url = `${this.api}/${filter.pilId}`;

      return this.http.get<Pilar[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Pilar> {
      const url = `${this.api}/${id}`;
      const params = { pilId: id };
      return this.http.get<Pilar[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }

   findPilar(filter: PilarFilter): Observable<Pilar[]> {
      const empId = filter.empId ==''?'0':filter.empId;
      const nivId = filter.nivId ==''?'0':filter.nivId;
      const url = `${this.api}/listarPilares/${empId}/${nivId}`;

      return this.http.get<Pilar[]>(url, {headers: headers});
   }


   findPilarPorcentaje(filter: PilarFilter): Observable<Pilar[]> {
      const empId = filter.empId ==''?'0':filter.empId;
      const nivId = filter.nivId ==''?'0':filter.nivId;
      const url = `${this.api}/listarPilares/${empId}/${nivId}`;

      return this.http.get<Pilar[]>(url, {headers: headers});
   }


   load(): Observable<Pilar[]> {
      return this.findAll().pipe(
         tap(result => {
            this.pilarList = result; // Asignamos los datos a pilarList
         }),
         catchError(err => {
            console.error('Error cargando pilares', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }
   

   loadPilar(filter: PilarFilter): void {
      this.findPilar(filter).subscribe({
         next: result => {
            this.pilarList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: Pilar): Observable<Pilar> {

      let url = `${this.api}/${this.user.userid}`;
      if (entity.pilId) {
         return this.http.put<Pilar>(url, entity, {headers:headers});
      } else {
         return this.http.post<Pilar>(url, entity, {headers:headers});
      }
   }

}

