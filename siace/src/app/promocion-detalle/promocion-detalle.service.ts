import { PromocionDetalle } from './promocion-detalle';
import { PromocionDetalleFilter } from './promocion-detalle-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class PromocionDetalleService extends GeneralService {
   promocionDetalleList: PromocionDetalle[] = [];
   api = this.sUrl + 'PromocionesDetalles';


   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */

   delete(entity: PromocionDetalle): Observable<PromocionDetalle> {
      let params = new HttpParams();
      let url = '';
      if (entity.prdId) {
         url = `${this.api}/${entity.prdId.toString()}`;
         params = new HttpParams().set('ID', entity.prdId.toString());
         return this.http.delete<PromocionDetalle>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: PromocionDetalleFilter): Observable<PromocionDetalle[]> {
      const url = `${this.api}/${filter.prdId}/${filter.prdPmoId}/${filter.prdProId}/${filter.prdFamId}/${filter.prdPreId}`;

      return this.http.get<PromocionDetalle[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<PromocionDetalle> {
      const url = `${this.api}/${id}`;
      const params = { prdId: id };
      return this.http.get<PromocionDetalle[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: PromocionDetalleFilter): void {
      this.find(filter).subscribe({
         next: result => {
            this.promocionDetalleList = result;
         },
         error: err => {
            console.error('error cargando', err);
         }
      });
   }

  
   save(entity: PromocionDetalle): Observable<PromocionDetalle> {
      let url = `${this.api}`;
      if (entity.prdId) {
         return this.http.put<PromocionDetalle>(url, entity, {headers:headers});
      } else {
         return this.http.post<PromocionDetalle>(url, entity, {headers:headers});
      }
   }

}

