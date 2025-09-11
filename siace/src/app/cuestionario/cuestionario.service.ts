import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pregunta } from './pregunta';
import { GeneralService } from '../common/general.service';
import { promedioInterface } from './promedioRequest';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class CuestionarioService extends GeneralService {
  api = this.sUrl + 'Preguntas';

  /* Constructores*/

  constructor(private http: HttpClient) {
    super();
  }

  //---------------------------Este lo muevo al shared
  searchPreguntas(id: number): Observable<Pregunta[]> {
    const apiUrl = `${this.api}/Allquestions/${id}`;
    return this.http.get<Pregunta[]>(apiUrl, { headers: headers });
  }

  //---------------------------Este NO
  saveUpdateQuestions(
    request: Pregunta[],
    idContestacion: number
  ): Observable<any> {
    const apiUrl = `${this.api}/save/${idContestacion}`;
    return this.http.post<Pregunta[]>(apiUrl, request, { headers: headers });
  }

  generatePdfFile(request: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const apiUrl = `${this.api}/generate`;
    return this.http.post(apiUrl, request, {
      headers: headers,
      responseType: 'blob',
    });
  }

  updateAverage(promedioData: promedioInterface): Observable<any> {
    const apiUrl = `${this.api}/updateAverage/${promedioData.contestacionId}`;
    const request = {
      promedio: promedioData.promedio,
    };
    
    return this.http.put(apiUrl, request, {
      headers: headers,
      responseType: 'blob',
    });
  }
}
