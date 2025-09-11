import { Sesion } from './sesion';
import { SesionFilter } from './sesion-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { SesionObjetivo } from './sesion-objetivo';
import { SesionObjetivoFilter } from './sesion-objetivo-filter';
import { tap } from 'rxjs/operators';
import { ObjetivoFilter } from '../objetivo/objetivo-filter';
import { Objetivo } from '../objetivo/objetivo';
import { ApplicationUser } from '../login/login.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class SesionObjetivoService extends GeneralService {
   sesionObjetivoList: SesionObjetivo[] = [];
   api = this.sUrl + 'RespuestasSesiones';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }


   /* Métodos */
   




   //Carga de formatos-----------
   findFormatos(filter: ObjetivoFilter): Observable<SesionObjetivo[]> {
      const sesId=filter.sesId ==''?'0': filter.sesId;
      const objId=filter.objId ==''?'0': filter.objId;
      const url = `${this.api}/listar/${sesId}/${objId}`;

      return this.http.get<SesionObjetivo[]>(url, {headers: headers});
   }

   loadFormatos(filter: ObjetivoFilter): Observable<SesionObjetivo[]> {
      return this.findFormatos(filter).pipe(
         tap(result => {
            this.sesionObjetivoList = result;
         })
      );
   }


   upload(archivo: File, idSesion: number, idObjetivo: number): Observable<string>{
      const formData = new FormData();
      formData.append('file', archivo);

      // Construye los parámetros del URL de forma segura usando URLSearchParams
      const params = new URLSearchParams();
      params.set('sesId', idSesion.toString());
      params.set('objId', idObjetivo.toString());
      params.set('userId', this.user.userid.toString()); 

      const postUrl = `${this.api}?${params.toString()}`;

      return this.http.post<string>(postUrl, formData);
   }


   delete(seoId:number): Observable<SesionObjetivo> {
      const url = `${this.api}/${seoId}/${this.user.userid}`;
      return this.http.delete<SesionObjetivo>(url, {headers: headers});
   }

}