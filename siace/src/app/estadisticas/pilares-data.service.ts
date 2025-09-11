import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../common/general.service';
import { Pilare } from '../dto/dtoBusiness';


@Injectable({
  providedIn: 'root'
})
export class PilaresService extends GeneralService {
  //private apiUrl = 'https://localhost:7154/api/Pilares'; // Cambia esto por la URL de tu API

  //this.sUrl=this.sUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    super();
  }

  getPilar(id: number): Observable<Pilare> {
    return this.http.get<Pilare>(`${this.sUrl}Pilares/${id}`)
  }

  getPilares(): Observable<Pilare[]> {
    return this.http.get<Pilare[]>(this.sUrl + 'Pilares')
    ;
  }

  deletePilar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sUrl}Pilares/${id}`, this.httpOptions)
    ;
  }

  addPilar(pilar: Pilare): Observable<Pilare> {
    return this.http.post<Pilare>(this.sUrl + 'Pilares', pilar, this.httpOptions)
    ;
  }

  updatePilar(id: number, pilar: Pilare): Observable<void> {
    return this.http.put<void>(`${this.sUrl}Pilares/${id}`, pilar, this.httpOptions)
    ;
  }

  /*private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }*/
}