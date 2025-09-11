import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../common/general.service';
import { Emprendedore } from '../dto/dtoBusiness';


const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class EmprendedoresDataService extends GeneralService {

  private baseUrl: string = `${this.sUrl}Emprendedores`; // Utilizar environment.apiUrl

  constructor(private http: HttpClient) {
    super();
  }

  
  getAll(): Observable<Emprendedore[]> {
    const listUrl = `${this.baseUrl}/listarEmprendedores`;
    return this.http.get<Emprendedore[]>(listUrl, { headers });
  }

  getEmprendedor(id: number): Observable<Emprendedore> {
    const detailUrl = `${this.baseUrl}/${id}`;
    return this.http.get<Emprendedore>(detailUrl, { headers });
  }

  updateEmprendedor(id: number, emprendedor: Emprendedore): Observable<void> {
    const updateUrl = `${this.baseUrl}/${id}`;
    return this.http.put<void>(updateUrl, emprendedor, { headers });
  }

  deleteEmprendedor(id: number): Observable<void> {
    const deleteUrl = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(deleteUrl, { headers });
  }

  // no borrar
}
