import { Proveedor } from './proveedor';
import { ProveedorFilter } from './proveedor-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProveedorService extends GeneralService {
  proveedorList: Proveedor[] = [];
  api = this.sUrl + 'Proveedor';

  /* Constructores*/

  constructor(private http: HttpClient) {
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

  /* Métodos */

  delete(entity: Proveedor): Observable<Proveedor> {
    let params = new HttpParams();
    let url = '';
    if (entity.pveId) {
      url = `${this.api}/${entity.pveId.toString()}`;
      params = new HttpParams().set('ID', entity.pveId.toString());
      return this.http.delete<Proveedor>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: ProveedorFilter): Observable<Proveedor[]> {
    const url = `${this.api}/${filter.pveId}/${filter.pveActivo}/${filter.pveCiuId}/${filter.pveColId}`;
    return this.http.get<Proveedor[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findById(id: string): Observable<Proveedor> {
    const url = `${this.api}/${id}`;
    const params = { pveId: id };
    return this.http
      .get<Proveedor[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((ele) => ele[0]));
  }

  findColonia(idColonia: string): Observable<any[]> {
    const url = `${this.api}/getColonias/${idColonia}`;

    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findAllCities(): Observable<Proveedor[]> {
    const url = `${this.api}/getAllCities`;

    return this.http.get<Proveedor[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findAllEstados(): Observable<any[]> {
    const url = `${this.api}/getAllEstados`;

    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findMunicipios(estId: number): Observable<any[]> {
    const url = `${this.api}/getMunicipios/${estId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findCiudades(munId: number): Observable<any[]> {
    const url = `${this.api}/getCiudades/${munId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findColonias(ciuId: number): Observable<any[]> {
    const url = `${this.api}/getColonias/${ciuId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  getUbicacionCompletaByCiudad(ciuId: number): Observable<any> {
    const url = `${this.api}/getUbicacionCompletaByCiudad/${ciuId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }
  load(filter: ProveedorFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.proveedorList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: Proveedor): Observable<Proveedor> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token

    if (entity.pveId) {
      return this.http.put<Proveedor>(url, entity, { headers });
    } else {
      return this.http.post<Proveedor>(url, entity, { headers });
    }
  }
}
