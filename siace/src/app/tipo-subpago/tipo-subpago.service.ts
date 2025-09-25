import { TipoSubpago } from './tipo-subpago';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { TipoSubpagoFilter } from './tipo-subpago-filter';

@Injectable()
export class TipoSubpagoService extends GeneralService {
  tipoSubpagoList: TipoSubpago[] = [];
  api = this.sUrl + 'SubtipoPagos';

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

  delete(entity: TipoSubpago): Observable<TipoSubpago> {
    let params = new HttpParams();
    let url = '';
    if (entity.SpaId) {
      url = `${this.api}/${entity.SpaId.toString()}`;
      return this.http.delete<TipoSubpago>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: TipoSubpagoFilter): Observable<TipoSubpago[]> {
    const url = `${this.api}/${filter.SpaId}`;
    return this.http.get<TipoSubpago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findByPagoId(idTipoPago: string): Observable<TipoSubpago[]> {
    const url = `${this.api}/getSubtipoPagos/${idTipoPago}`;
    return this.http.get<TipoSubpago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findById(id: string): Observable<TipoSubpago> {
    const url = `${this.api}/${id}`;
    const params = { pobId: id };
    return this.http
      .get<TipoSubpago[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((ele) => ele[0]));
  }

  findAllTipoPagos(): Observable<TipoSubpago[]> {
    const url = `${this.api}/getTipoPagos`;
    return this.http.get<TipoSubpago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findSubtipoPagos(tipoPagoId: number): Observable<TipoSubpago[]> {
    const url = `${this.api}/getSubtipoPagos/${tipoPagoId}`;
    return this.http.get<TipoSubpago[]>(url, {
      headers: this.getHeaders(),
    });
  }

  load(filter: TipoSubpagoFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.tipoSubpagoList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: TipoSubpago): Observable<TipoSubpago> {
    let url = `${this.api}`;
    const headers = this.getHeaders();

    if (entity.SpaId) {
      return this.http.put<TipoSubpago>(url, entity, { headers });
    } else {
      return this.http.post<TipoSubpago>(url, entity, { headers });
    }
  }
}
