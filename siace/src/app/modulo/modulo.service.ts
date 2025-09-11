import { Modulo } from './modulo';
import { ModuloFilter } from './modulo-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ModuloService extends GeneralService {
   moduloList: Modulo[] = [];
   api = this.sUrl + 'Modulos';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Modulo): Observable<any> {
      let params = new HttpParams();
      let url = '';
      if (entity.modId) {
         url = `${this.api}/${entity.modId.toString()}`;
         params = new HttpParams().set('ID', entity.modId.toString());
         return this.http.delete<Modulo>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ModuloFilter): Observable<Modulo[]> {
      const url = `${this.api}/${filter.rolId}/${filter.modId}`;

      return this.http.get<Modulo[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Modulo> {
      const url = `${this.api}/${id}`;
      const params = { modId: id };
      return this.http.get<Modulo[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ModuloFilter): void {
      this.find(filter).subscribe(result => {
         this.moduloList = result;
      },
         err => {
            console.error('error cargando', err);
         }
      );
   }

  
   save(entity: Modulo): Observable<any> {
      let url = `${this.api}`;
      if (entity.modId) {
         return this.http.put<Modulo>(url, entity, {headers:headers});
      } else {
         return this.http.post<Modulo>(url, entity, {headers:headers});
      }
   }

}

