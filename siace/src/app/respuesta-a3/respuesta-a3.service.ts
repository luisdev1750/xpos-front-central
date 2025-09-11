import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
} from 'rxjs';
import {
  map,
  tap,
} from 'rxjs/operators';
import { GeneralService } from '../common/general.service';
import { RespuestaA3 } from './respuesta-a3';
import { RespuestaA3Filter } from './respuesta-a3-filter';
import { ApplicationUser } from '../login/login.service';


const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class RespuestaA3Service extends GeneralService {
   respuestaA3List: RespuestaA3[] = [];
   api = this.sUrl + 'RespuestasA3';
   user!: ApplicationUser;
   /* Constructores*/
   
   constructor(private http: HttpClient) {
   	  super();
        this.user = JSON.parse(localStorage.getItem('user')!);
   }

   emergente = new Subject<number>();
   desarrollado= new Subject<number>();
   optimizado= new Subject<number>();



   /* Métodos */
   delete( reaId:number): Observable<RespuestaA3> {//empId:number, pilId:number, aaaId:number,
      const url = `${this.api}/${reaId}/${this.user.userid}`; //${empId}/${pilId}/${aaaId}/
      return this.http.delete<RespuestaA3>(url, {headers: headers});
   }
  
  
   find(filter: RespuestaA3Filter): Observable<RespuestaA3[]> {
      const empId=filter.reaEmpId==''?'0':filter.reaEmpId;
      const aaaId=filter.aaaId==''?'0':filter.aaaId;

      const url = `${this.api}/${empId}/${aaaId}`;

      return this.http.get<RespuestaA3[]>(url, {headers: headers});
   }
   
   
   findById(id: string): Observable<RespuestaA3> {
      const url = `${this.api}/${id}`;
      const params = { eviId: id };
      return this.http.get<RespuestaA3[]>(url, {headers: headers}).pipe(
         map(ele => ele[0])
      );
   }


   // load(filter: RespuestaA3Filter): void {
   //    this.find(filter).subscribe({
   //       next: result => {
   //          this.respuestaA3List = result;
   //       },
   //       error: err => {
   //          console.error('error cargando', err);
   //       }
   //    });
   // }

   //Tap se usa aquí para asignar el resultado de la llamada al servidor (result)
   //a la variable respuestaA3List sin modificar el flujo de datos.
   //Esto significa que después de ejecutar tap, el Observable sigue emitiendo
   //los mismos valores (result), permitiendo que el flujo continúe.
   load(filter: RespuestaA3Filter): Observable<RespuestaA3[]> {
      return this.find(filter).pipe(
        tap(result => {
          this.respuestaA3List = result;
        })
      );
    }

  
   save(entity: RespuestaA3): Observable<RespuestaA3> {
      let url = `${this.api}`;
      if (entity.reaId) {
         return this.http.put<RespuestaA3>(url, entity, {headers:headers});
      } else {
         return this.http.post<RespuestaA3>(url, entity, {headers:headers});
      }
   }


   upload(archivo: File, idEmprendedor: number, idPilar: number, idActividad: number, idEvidencia: number, descripcion: string): Observable<string>{
      const formData = new FormData();
      formData.append('file', archivo);

      // Construye los parámetros del URL de forma segura usando URLSearchParams
      const params = new URLSearchParams();
      params.set('emprendedorId', idEmprendedor.toString());
      params.set('pilarId', idPilar.toString());
      params.set('actividadId', idActividad.toString());
      params.set('evidenciaId', idEvidencia.toString());
      params.set('descripcion', descripcion);
      params.set('userId', this.user.userid.toString());
      const postUrl = `${this.api}?${params.toString()}`;

      return this.http.post<string>(postUrl, formData);
   }

   update(reaId: number, reaDescripcion: string): Observable<number>{
      let url = `${this.api}/${reaId}/${reaDescripcion}/${this.user.userid}`;
      let body = {
         reaId: reaId,
         reaDescripcion: reaDescripcion
      };

      return this.http.put<number>(url, body, {headers: headers });
   }


   

}

