import { Promocion } from './promocion';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';
import { PromocionFilter } from './promocion-filter';

@Injectable()
export class PromocionService extends GeneralService {
  promocionList: Promocion[] = [];
  api = this.sUrl + 'Promociones';

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

  delete(entity: Promocion): Observable<Promocion> {
    let params = new HttpParams();
    let url = '';
    if (entity.pmoId) {
      url = `${this.api}/${entity.pmoId.toString()}/${entity.pmoSucId.toString()}`;
      return this.http.delete<Promocion>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: PromocionFilter): Observable<Promocion[]> {
    const url = `${this.api}/${filter.pmoId}`;
    return this.http.get<Promocion[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findById(id: string): Observable<Promocion> {
    const url = `${this.api}/${id}`;
    const params = { pobId: id };
    return this.http
      .get<Promocion[]>(url, {
        headers: this.getHeaders(), // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  findAllTipoPagos(): Observable<Promocion[]> {
    const url = `${this.api}/getTipoPagos`;
    return this.http.get<Promocion[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findSubtipoPagos(tipoPagoId: number): Observable<Promocion[]> {
    const url = `${this.api}/getSubtipoPagos/${tipoPagoId}`;
    return this.http.get<Promocion[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  load(filter: PromocionFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.promocionList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: Promocion): Observable<Promocion> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token

    // Procesar las fechas antes de enviar
    const processedEntity = { ...entity };

    // Procesar pmoFechaInicio
    processedEntity.pmoFechaInicio =
      entity.pmoFechaInicio && entity.pmoFechaInicio !== 'all'
        ? new Date(entity.pmoFechaInicio).toISOString()
        : entity.pmoFechaInicio;

    // Procesar pmoFechaFin
    processedEntity.pmoFechaFin =
      entity.pmoFechaFin && entity.pmoFechaFin !== 'all'
        ? new Date(entity.pmoFechaFin).toISOString()
        : entity.pmoFechaFin;

    if (entity.pmoId) {
      return this.http.put<Promocion>(url, processedEntity, { headers });
    } else {
      return this.http.post<Promocion>(url, processedEntity, { headers });
    }
  }
}
