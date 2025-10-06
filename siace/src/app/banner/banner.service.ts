import { Banner } from './banner';
import { BannerFilter } from './banner-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, switchMap  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BannerService extends GeneralService {
   bannerList: Banner[] = [];
      api = this.sUrl + 'SucursalesBanner';
   
      constructor(private http: HttpClient, private toastr: ToastrService) {
         super();  
      }
   
      // Método para obtener headers con el token
      private getHeaders(): HttpHeaders {
         const token = localStorage.getItem('accessToken');
         let headers = new HttpHeaders().set('Accept', 'application/json');
         
         if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
         }
         
         return headers;
      }
     
      find(filter: BannerFilter): Observable<Banner[]> {
         const url = `${this.api}/${filter.subSucId}/${filter.subActivo}`;
         return this.http.get<Banner[]>(url, {
            headers: this.getHeaders()  // Usar headers con token
         });
      }
      
      findById(id: string): Observable<Banner> {
         const url = `${this.api}/${id}`;
         return this.http.get<Banner[]>(url, {
            headers: this.getHeaders()  // Usar headers con token
         }).pipe(
            map(ele => ele[0])
         );
      }
   
      load(filter: BannerFilter): void {
         this.find(filter).subscribe({
            next: result => {
               this.bannerList = result;
            },
            error: err => {
               console.error('error cargando', err);
               this.toastr.info(err.error, 'Información');
               this.bannerList = [];
            }
         });
      }


      loads(): void {
         const url = `${this.api}/listar/`;
         this.http.get<Banner[]>(url, {
            headers: this.getHeaders()  // Usar headers con token
         }).subscribe({
            next: result => {
               this.bannerList = result;
            },
            error: err => {
               console.error('error cargando', err);
            }
         });
      }
   
      save(entity: Banner): Observable<Banner> {
         let url = `${this.api}`;
         const headers = this.getHeaders();  // Obtener headers con token
         console.log('Guardando entidad:', entity);
         const sucursalId = Number(entity.subSucId); 
         if (entity.subId) {
            return this.http.put<Banner>(url, entity, { headers });
         }
         else {
            return this.subIdMax(sucursalId).pipe(
            switchMap((maxId: number) => {
                const nuevoSubId = maxId + 1;
                entity.subId = String(nuevoSubId); // Asignamos el nuevo ID
                console.log(`Max ID encontrado: ${maxId}. Asignando nuevo SubId: ${entity.subId}`);
                return this.http.post<Banner>(url, entity, { headers });
            })
        );
         }
      }

      delete(entity: Banner): Observable<Banner> {
         let params = new HttpParams();
         let url = '';
         if (entity.subId) {
            url = `${this.api}/${entity.subId.toString()}/${entity.subSucId.toString()}`;
            return this.http.delete<Banner>(url, {
               headers: this.getHeaders(), 
               params
            });
         }
         return EMPTY;
      }

      subIdMax(sucId: number): Observable<number> {
         const url = `${this.api}/max/${sucId}`;
         return this.http.get<number>(url, {
            headers: this.getHeaders()  // Usar headers con token
         });
      }
}
