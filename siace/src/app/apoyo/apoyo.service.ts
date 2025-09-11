import { Apoyo } from './apoyo';
import { ApoyoFilter } from './apoyo-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { catchError, map, tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class ApoyoService extends GeneralService {
   apoyoList: Apoyo[] = [];
   api = this.sUrl + 'Apoyo';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: Apoyo): Observable<Apoyo> {
      let params = new HttpParams();
      let url = '';
      if (entity.apoId) {
         url = `${this.api}/${entity.apoId.toString()}`;
         params = new HttpParams().set('ID', entity.apoId.toString());
         return this.http.delete<Apoyo>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: ApoyoFilter): Observable<Apoyo[]> {
      const aaaId=filter.apoAaaId==''?'0':filter.apoAaaId;
      const url = `${this.api}/PorActividad/${aaaId}`;

      return this.http.get<Apoyo[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<Apoyo> {
      const url = `${this.api}/${id}`;
      const params = { apoId: id };
      return this.http.get<Apoyo[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: ApoyoFilter): void {
      this.find(filter).subscribe(result => {
         this.apoyoList = result;
      },
         err => {
            console.error('error cargando', err);
         }
      );
   }

   loadApoyo(filter: ApoyoFilter): Observable<Apoyo[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.apoyoList = result;
         }),
         catchError(err => {
            console.error('Error cargando versiones', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

  
   save(entity: Apoyo, file: File | null): Observable<Apoyo> {
      let url = `${this.api}`;
      const formData = new FormData();

      // Añadir el archivo si está presente
      if (file) {
         formData.append('file', file, file.name);
      }

      // Construir los parámetros de la URL usando URLSearchParams
      const params = new URLSearchParams();
      params.set('apoAaaId', entity.apoAaaId.toString());
      params.set('apoTitulo', entity.apoTitulo);
      params.set('apoDescripcion', entity.apoDescripcion);
      params.set('apoLiga', entity.apoLiga ?? '');

      

      // Construir la URL con los parámetros
      const postUrl = `${this.api}/crearApoyo?${params.toString()}`;
      

      // Omitir 'headers: headers' cuando se crea un FormData
      const httpOptions = {
         headers: new HttpHeaders({
            Accept: 'application/json',
         })
      };

      if (entity.apoId) {
         const putParams = new URLSearchParams();
         putParams.set('apoId', entity.apoId.toString());
         putParams.set('apoTitulo', entity.apoTitulo);
         putParams.set('apoDescripcion', entity.apoDescripcion);
         putParams.set('apoLiga', entity.apoLiga ?? '');
         const putUrl = `${this.api}/actualizarApoyo?${putParams.toString()}`;
         return this.http.put<Apoyo>(putUrl, formData, httpOptions);
      } else {
         
         return this.http.post<Apoyo>(postUrl, formData, httpOptions);
      }
   }


   deleteDoc(apoId: number): Observable<any> {
      const url = `${this.api}/eliminarDoc/${apoId}`;
      return this.http.delete(url, { headers });
   }
}

