import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../common/general.service';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class BuscarContestacionesService extends GeneralService {
  api = this.sUrl + 'Contestaciones';

  /* Constructores*/

  constructor(private http: HttpClient) {
    super();
  }

  searchPreguntas(fechaInicial: string, fechaFinal: string, empId: string): Observable<any> {
    const apiUrl = `${this.api}/${fechaInicial}/${fechaFinal}/${empId}`;

    return this.http.get<any>(apiUrl, { headers: headers });
  }

  createContestacion(conNombre: string, empId: number, conFecha?: Date): Observable<any> {
    const apiUrl = `${this.api}`;
    console.log("Datos recibidos");
    
  
    console.log(conFecha);
    
    
    
    // Crear el cuerpo de la solicitud con todas las propiedades necesarias
    const body = {
      conNombre: conNombre,
      empId: empId,
      conFecha:  conFecha,
    };
  
    // Configuración de encabezados (ajustar según tus necesidades)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    // Realizar la solicitud POST con el cuerpo y los encabezados
    return this.http.post<any>(apiUrl, body, { headers: headers });
  }

  findResults(idContestacion: number): Observable<any> {
    const apiUrl = `${this.api}/getSumaContestacione/${idContestacion}`;
    return this.http.get<any>(apiUrl, { headers: headers });
  }

  validarRFC(rfcUser: string): Observable<any> {
    const apiUrl = `${this.api}/check/${rfcUser}`;
    return this.http.get<any>(apiUrl, { headers: headers });
  }

  getSumapilares(conId: number): Observable<any>{
    const apiUrl = `${this.api}/getSumaContestacione/${conId}`;
    return this.http.get<any>(apiUrl, {headers: headers}); 
  }

  getRFC(conId: number): Observable<any>{
    const apiUrl = `${this.api}/getRFC/${conId}`;
    return this.http.get<any>(apiUrl, {headers: headers}); 
  }
}
