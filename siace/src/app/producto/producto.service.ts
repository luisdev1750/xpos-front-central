import { Producto } from './producto';
import { ProductoFilter } from './producto-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoService extends GeneralService {
  productoList: Producto[] = [];
  api = this.sUrl + 'Productos';

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

  delete(entity: Producto): Observable<Producto> {
    let params = new HttpParams();
    let url = '';
    if (entity.proId) {
      url = `${this.api}/${entity.proId.toString()}`;
      params = new HttpParams().set('ID', entity.proId.toString());
      return this.http.delete<Producto>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: ProductoFilter): Observable<Producto[]> {
    const url = `${this.api}/${filter.proId}/${filter.proFamId}/${filter.proPreId}/${filter.proActivo}`;
    return this.http.get<Producto[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findProductsForPromocionesObsequios(pobPmoId: number, pobPmoSucId: number){
    ///getProductosFromPromocionesObsequios/{pobPmoId}/{pobPmoSucId}
    const url = `${this.api}/getProductosFromPromocionesObsequios/${pobPmoId}/${pobPmoSucId}`;

    return this.http.get<Producto[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findById(id: string): Observable<Producto> {
    const url = `${this.api}/${id}`;
    const params = { proId: id };
    return this.http
      .get<Producto[]>(url, {
        headers: this.getHeaders(), // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  findByCatalogo(catalogo: string): Observable<any[]> {
    const url = `${this.api}/${catalogo}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findByWord(word: string): Observable<any[]> {
    const url = `${this.api}/search?q=${word}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findByWordGeneral(word: string): Observable<any[]> {
    const url = `${this.api}/searchGeneral?q=${word}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }
  findProductos(searchText: string) {
    const url = `${this.api}/productosPreciosProductos/?searchText=${searchText}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  
  load(filter: ProductoFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.productoList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: Producto): Observable<Producto> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token

    if (entity.proId) {
      return this.http.put<Producto>(url, entity, { headers });
    } else {
      return this.http.post<Producto>(url, entity, { headers });
    }
  }
}
