import { Role } from './role';
import { RoleFilter } from './role-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map, tap } from 'rxjs/operators';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class RoleService extends GeneralService {
   roleList: Role[] = [];
   api = this.sUrl + 'Roles';
   user!: ApplicationUser;
   constructor(private http: HttpClient) {
      super();
      this.user = JSON.parse(localStorage.getItem('user')!);
   }

   findById(id: string): Observable<Role> {
      const url = `${this.api}/0/${id}`;
      const params = { rolId: id };
      return this.http.get<Role[]>(url, { headers: headers }).pipe(
         map(rol => rol[0])
      );
   }

   // load(filter: RoleFilter): void {
   //    this.find(filter).subscribe(result => {
   //       this.roleList = result;
   //    },
   //       err => {
   //          console.error('error loading', err);
   //       }
   //    );
   // }


   load(filter: RoleFilter, logEmpId?: number): Observable<Role[]> {
      return this.find(filter, logEmpId).pipe(
         tap(result => {
            this.roleList = result;
         })
      );
   }

   find(filter: RoleFilter, logEmpId?: number): Observable<Role[]> {
      const iRolId = filter.rolId === '' ? '0' : filter.rolId;
      //const empId = filter.rolEmpId === '' ? '0' : filter.rolEmpId;
      const empId = logEmpId ? logEmpId : (filter.rolEmpId === '' ? '0' : filter.rolEmpId);
      const includeGeneral = filter.includeGeneral === '' ? 'false' : 'true';
      const url = `${this.api}/${empId}/${iRolId}/${includeGeneral}`;
      /*const params = {
         'rolId': filter.rolId,
         'rolPrmId': filter.rolPrmId,
      };*/

      return this.http.get<Role[]>(url, { headers: headers });
   }

   save(entity: Role): Observable<any> {
      let params = new HttpParams();
      let url = `${this.api}/${this.user.userid}`;
      if (entity.rolId) {
         //url = `${this.api}`; //${entity.rolId.toString()}`;
         //params = new HttpParams().set('ID', entity.rolId.toString());
         return this.http.put<Role>(url, entity, { headers, params });
      } else {
         return this.http.post<Role>(url, entity, { headers, params });
      }
   }

   delete(entity: Role): Observable<any> {
      let params = new HttpParams();
      let url = '';

      
      if (entity.rolId) {
         const body =  { userId: this.user.userid ?? 1 , id: entity.rolId};
         url = `${this.api}/${entity.rolId.toString()}`;
         // params = new HttpParams().set('ID', entity.rolId.toString());
         return this.http.delete<Role>(url, { headers,  body });
      }
      return EMPTY;
   }
}

