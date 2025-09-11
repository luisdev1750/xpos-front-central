import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { Permiso } from './permiso';
import { ModuloFilter } from '../modulo/modulo-filter';
import { Modulo } from '../modulo/modulo';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class PermisoService extends GeneralService {
   api = this.sUrl;
   user!: ApplicationUser;
   constructor(private http: HttpClient) {
      super();
      this.user = JSON.parse(localStorage.getItem('user')!);
   }


   find(filter: ModuloFilter): Observable<Modulo[]> {
      const url = `${this.api}Permisos/Listar/${filter.empId}/${filter.rolId}`;

      return this.http.get<Modulo[]>(url, { headers: headers });
   }


   save(entity: Permiso): Observable<any> { 
      let url = `${this.api}Permisos/${this.user.userid}`;
      return this.http.post<any>(url, entity, { headers: headers });
   }
} 

