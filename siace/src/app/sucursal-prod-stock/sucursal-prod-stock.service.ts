import { SucursalProdStock } from './sucursal-prod-stock';
import { SucursalProdStockFilter } from './sucursal-prod-stock-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SucursalProdStockService extends GeneralService {
  sucursalProdStockList: SucursalProdStock[] = [];
  api = this.sUrl + 'SucursalesProdStocks';

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

  delete(entity: SucursalProdStock): Observable<SucursalProdStock> {
    let params = new HttpParams();
    let url = '';
    if (entity.spsSucId) {
      url = `${this.api}/${entity.spsSucId.toString()}`;
      params = new HttpParams().set('ID', entity.spsSucId.toString());
      return this.http.delete<SucursalProdStock>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: SucursalProdStockFilter): Observable<SucursalProdStock[]> {
    const url = `${this.api}/${filter.spsSucId}/${filter.spsProId}`;
    return this.http.get<SucursalProdStock[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findCatalog(sucursal: number): Observable<any[]> {
    const url = `${this.api}/sucursal/${sucursal}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  
  findCatalogExcluir(sucursal: number): Observable<any[]> {
    const url = `${this.api}/sucursalExcluir/${sucursal}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findById(id: string): Observable<SucursalProdStock> {
    const url = `${this.api}/${id}`;
    const params = { spsSucId: id };
    return this.http
      .get<SucursalProdStock[]>(url, {
        headers: this.getHeaders(), // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  load(filter: SucursalProdStockFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.sucursalProdStockList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: SucursalProdStock): Observable<SucursalProdStock> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token
    return this.http.post<SucursalProdStock>(url, entity, { headers });
  }
}
