import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../common/general.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class EncuestaListService extends GeneralService { 
  api = this.sUrl + 'CuestionarioExcel';


  /* Constructores*/
  
  constructor(private http: HttpClient) {
      super();
  }


  getFormattedDate(date: string): string {
    const dateObject = new Date(date); // Convierte el string a un objeto Date
    return dateObject.toISOString(); // Convierte el objeto Date a string en formato ISO 8601
  }


  searchPreguntas(
    fechaInicial: string,
    fechaFinal: string,
    estatus: string
  ): Observable<any> {
    const status=estatus==''?'0':estatus;
    const apiUrl = `${this.api}/listarArchivos/${fechaInicial}/${fechaFinal}/${status}`;
  
    return this.http.get<any>(apiUrl, { headers: headers });
  }


  downloadFile(fileName: string){
    const archivoNombre = fileName.replace("Cuestionarios/", "");
    const apiUrl = `${this.api}/descargarEncuesta?filename=${archivoNombre}`;
    console.log('Busqueda');
    console.log(apiUrl);
 
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
}
