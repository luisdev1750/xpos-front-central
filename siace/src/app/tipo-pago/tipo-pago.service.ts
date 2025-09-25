import { TipoPago } from './tipo-pago';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { TipoPagoFilter } from './tipo-pago-filter';

@Injectable()
export class TipoPagoService extends GeneralService {
  tipoPagoList: TipoPago[] = [];
  api = this.sUrl + 'TipoPagos';

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

  delete(entity: TipoPago): Observable<TipoPago> {
    let params = new HttpParams();
    let url = '';
    if (entity.TpaId) {
      url = `${this.api}/${entity.TpaId.toString()}`;
      return this.http.delete<TipoPago>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: TipoPagoFilter): Observable<TipoPago[]> {
    const url = `${this.api}/${filter.TpaId}`;
    return this.http.get<TipoPago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findById(id: string): Observable<TipoPago> {
    const url = `${this.api}/${id}`;
    const params = { pobId: id };
    return this.http
      .get<TipoPago[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((ele) => ele[0]));
  }

 findAll(): Observable<TipoPago[]> {
    const url = `${this.api}/getAllTipoPagos`;
    return this.http.get<TipoPago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  load(filter: TipoPagoFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.tipoPagoList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: TipoPago): Observable<TipoPago> {
    let url = `${this.api}`;
    const headers = this.getHeaders();

    if (entity.TpaId) {
      return this.http.put<TipoPago>(url, entity, { headers });
    } else {
      return this.http.post<TipoPago>(url, entity, { headers });
    }
  }
}