import { PromocionDetalle } from './promocion-detalle';
import { PromocionDetalleFilter } from './promocion-detalle-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PromocionDetalleService extends GeneralService {
  promocionDetalleList: PromocionDetalle[] = [];
  api = this.sUrl + 'PromocionesDetalles';

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

  getCatalogos(
    familiaId?: number,
    productoId?: number,
    presentacionId?: number
  ): Observable<any> {
    let params = new HttpParams();

    if (familiaId !== null && familiaId !== undefined) {
      params = params.set('familiaId', familiaId.toString());
    }

    if (productoId !== null && productoId !== undefined) {
      params = params.set('productoId', productoId.toString());
    }

    if (presentacionId !== null && presentacionId !== undefined) {
      params = params.set('presentacionId', presentacionId.toString());
    }

    return this.http.get<any>(`${this.api}/catalogos`, {
      headers: this.getHeaders(),  // Usar headers con token
      params: params,
    });
  }

  getCatalogosIniciales(): Observable<any> {
    return this.getCatalogos(); // Sin parámetros = carga todo
  }

  /* Métodos */

  delete(entity: PromocionDetalle): Observable<PromocionDetalle> {
    let params = new HttpParams();
    let url = '';
    if (entity.prdId) {
      url = `${this.api}/${entity.prdId.toString()}`;
      params = new HttpParams().set('ID', entity.prdId.toString());
      return this.http.delete<PromocionDetalle>(url, { 
        headers: this.getHeaders(),  // Usar headers con token
        params 
      });
    }
    return EMPTY;
  }

  find(filter: PromocionDetalleFilter): Observable<PromocionDetalle[]> {
    console.log("Cuerpo a enviar");
    console.log(filter);
    
    
    const url = `${this.api}/${filter.prdPmoId}`;
    console.log("url");
    console.log(url);
        
    return this.http.get<PromocionDetalle[]>(url, { 
      headers: this.getHeaders()  // Usar headers con token
    });
    
  }

  findById(id: string): Observable<PromocionDetalle> {
    const url = `${this.api}/${id}`;
    const params = { prdId: id };
    return this.http
      .get<PromocionDetalle[]>(url, { 
        headers: this.getHeaders()  // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  load(filter: PromocionDetalleFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.promocionDetalleList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: PromocionDetalle): Observable<PromocionDetalle> {
    let url = `${this.api}`;
    const headers = this.getHeaders();  // Obtener headers con token
    
    if (entity.prdId) {
      return this.http.put<PromocionDetalle>(url, entity, { headers });
    } else {
      return this.http.post<PromocionDetalle>(url, entity, { headers });
    }
  }
}