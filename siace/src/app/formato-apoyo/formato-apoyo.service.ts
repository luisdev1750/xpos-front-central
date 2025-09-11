import { FormatoApoyo } from './formato-apoyo';
import { FormatoApoyoFilter } from './formato-apoyo-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { catchError, map, tap } from 'rxjs/operators';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class FormatoApoyoService extends GeneralService {
   formatoApoyoList: FormatoApoyo[] = [];
   api = this.sUrl + 'FormatoApoyo';

   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
   }


   /* Métodos */
   delete(entity: FormatoApoyo): Observable<FormatoApoyo> {
      let params = new HttpParams();
      let url = '';
      if (entity.foaId) {
         url = `${this.api}/${entity.foaId.toString()}`;
         params = new HttpParams().set('ID', entity.foaId.toString());
         return this.http.delete<FormatoApoyo>(url, {headers, params});
      }
      return EMPTY;
   }
  
  
   find(filter: FormatoApoyoFilter): Observable<FormatoApoyo[]> {
      const apoId=filter.foaApoId==''?'0':filter.foaApoId;
      const url = `${this.api}/${apoId}`;

      return this.http.get<FormatoApoyo[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<FormatoApoyo> {
      const url = `${this.api}/${id}`;
      const params = { foaId: id };
      return this.http.get<FormatoApoyo[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   load(filter: FormatoApoyoFilter): void {
      this.find(filter).subscribe(result => {
         this.formatoApoyoList = result;
      },
         err => {
            console.error('error cargando', err);
         }
      );
   }


   loadFormato(filter: FormatoApoyoFilter): Observable<FormatoApoyo[]> {
      return this.find(filter).pipe(
         tap(result => {
            this.formatoApoyoList = result;
         }),
         catchError(err => {
            console.error('Error cargando versiones', err);
            return of([]); // Devuelve un observable vacío en caso de error
         })
      );
   }

  
   save(entity: FormatoApoyo, file: File | null): Observable<FormatoApoyo> {
      // let url = `${this.api}`;
      // if (entity.foaId) {
      //    return this.http.put<FormatoApoyo>(url, entity, {headers:headers});
      // } else {
      //    return this.http.post<FormatoApoyo>(url, entity, {headers:headers});
      // }
      let url = `${this.api}`;
      const formData = new FormData();

      // Añadir el archivo si está presente
      if (file) {
         formData.append('file', file, file.name);
      }

      // Construir los parámetros de la URL usando URLSearchParams
      const params = new URLSearchParams();
      params.set('foaApoId', entity.foaApoId.toString());

      

      // Construir la URL con los parámetros
      const postUrl = `${this.api}/crearFormatoApoyo?${params.toString()}`;
      

      // Omitir 'headers: headers' cuando se crea un FormData
      const httpOptions = {
         headers: new HttpHeaders({
            Accept: 'application/json',
         })
      };

      if (entity.foaId) {
         // const putParams = new URLSearchParams();
         // putParams.set('apoId', entity.apoId.toString());
         // putParams.set('apoTitulo', entity.apoTitulo);
         // putParams.set('apoDescripcion', entity.apoDescripcion);
         // putParams.set('apoLiga', entity.apoLiga ?? '');
         // const putUrl = `${this.api}/actualizarApoyo?${putParams.toString()}`;
         return this.http.put<FormatoApoyo>(url, formData, httpOptions);
      } else {
         
         return this.http.post<FormatoApoyo>(postUrl, formData, httpOptions);
      }
   }

}

