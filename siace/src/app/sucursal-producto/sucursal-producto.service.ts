import { SucursalProducto } from './sucursal-producto';
import { SucursalProductoFilter } from './sucursal-producto-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class SucursalProductoService extends GeneralService {
   sucursalProductoList: SucursalProducto[] = [];
   api = this.sUrl + 'SucursalesProductos';


   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */

   delete(entity: SucursalProducto): Observable<SucursalProducto> {
      let params = new HttpParams();
      let url = '';
      if (entity.supSucId) {
         url = `${this.api}/${entity.supSucId.toString()}`;
         params = new HttpParams().set('ID', entity.supSucId.toString());
         return this.http.delete<SucursalProducto>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: SucursalProductoFilter): Observable<SucursalProducto[]> {
      const url = `${this.api}/${filter.supSucId}/${filter.supProId}/${filter.supLprId}`;

      return this.http.get<SucursalProducto[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<SucursalProducto> {
      const url = `${this.api}/${id}`;
      const params = { supSucId: id };
      return this.http.get<SucursalProducto[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: SucursalProductoFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.sucursalProductoList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: SucursalProducto): Observable<SucursalProducto> {
      let url = `${this.api}`;
      if (entity.supSucId) {
         return this.http.put<SucursalProducto>(url, entity, {headers:headers});
      } else {
         return this.http.post<SucursalProducto>(url, entity, {headers:headers});
      }
   }

}

