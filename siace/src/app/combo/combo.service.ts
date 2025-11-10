import { Combo } from './combo';
import { ComboFilter } from './combo-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

// Elimina el headers constante global y crea un método para generar headers con token
@Injectable()
export class ComboService extends GeneralService {
  comboList: Combo[] = [];
  api = this.sUrl + 'Combos';

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

  delete(entity: Combo): Observable<Combo> {
    let params = new HttpParams();
    let url = '';
    if (entity.comboId) {
      url = `${this.api}/${entity.comboId.toString()}/${entity.sucursalId.toString()}`;

      return this.http.delete<Combo>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  find(filter: ComboFilter): Observable<Combo[]> {
    const url = `${this.api}/${filter.comboSucId}/${filter.comboActivo}`;
    return this.http.get<Combo[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findProductos(sucId: number): Observable<Combo[]> {
    const url = `${this.api}/productosPorSucursales/${sucId}`;
    return this.http.get<Combo[]>(url, {
      headers: this.getHeaders(), // Usar headers con token
    });
  }

  findById(id: string): Observable<Combo> {
    const url = `${this.api}/${id}`;
    const params = { banId: id };
    return this.http
      .get<Combo[]>(url, {
        headers: this.getHeaders(), // Usar headers con token
      })
      .pipe(map((ele) => ele[0]));
  }

  load(filter: ComboFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.comboList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  save(entity: Combo): Observable<Combo> {
    let url = `${this.api}`;
    const headers = this.getHeaders(); // Obtener headers con token

    if (entity.comboId) {
      return this.http.put<Combo>(url, entity, { headers });
    } else {
      return this.http.post<Combo>(url, entity, { headers });
    }
  }

  // En combo.service.ts, agrega este método:

  copyComboToSucursal(
    comboIds: number[],
    targetSucursalId: number
  ): Observable<any> {
    const headers = this.getHeaders(); // Obtener headers con token
    return this.http.post(
      `${this.api}/copiar-a-sucursal`,
      {
        comboIds: comboIds,
        targetSucursalId: targetSucursalId,
      },
      { headers }
    );
  }
}
