import { ListaPrecio } from './lista-precio';
import { ListaPrecioFilter } from './lista-precio-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ListaPrecioService extends GeneralService {
  listaPrecioList: ListaPrecio[] = [];
  api = this.sUrl + 'ListaPrecios';

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

  delete(entity: ListaPrecio): Observable<ListaPrecio> {
    let params = new HttpParams();
    let url = '';
    if (entity.lprId) {
      url = `${this.api}/${entity.lprId.toString()}`;
      params = new HttpParams().set('ID', entity.lprId.toString());
      return this.http.delete<ListaPrecio>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: ListaPrecioFilter): Observable<ListaPrecio[]> {
    const fechaVigencia =
      filter.lprFechaVigencia && filter.lprFechaVigencia !== 'all'
        ? new Date(filter.lprFechaVigencia).toISOString()
        : 'all';

    const fechaAlta =
      filter.lprFechaAlta && filter.lprFechaAlta !== 'all'
        ? new Date(filter.lprFechaAlta).toISOString()
        : 'all';

    const url = `${this.api}/${filter.lprId}/${filter.lprActivo}/${fechaVigencia}/${fechaAlta}`;

    return this.http.get<ListaPrecio[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findById(id: string): Observable<ListaPrecio> {
    const url = `${this.api}/${id}`;
    const params = { lprId: id };
    return this.http
      .get<ListaPrecio[]>(url, {
        headers: this.getHeaders(), // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  load(filter: ListaPrecioFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.listaPrecioList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: ListaPrecio): Observable<ListaPrecio> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token

    if (entity.lprId) {
      return this.http.put<ListaPrecio>(url, entity, { headers });
    } else {
      return this.http.post<ListaPrecio>(url, entity, { headers });
    }
  }
}
