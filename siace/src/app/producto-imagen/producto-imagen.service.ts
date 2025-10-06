import { ProductoImagen } from './producto-imagen';
import { ProductoImagenFilter } from './producto-imagen-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoImagenService extends GeneralService {
  productoImagenList: ProductoImagen[] = [];
  api = this.sUrl + 'ProductosImagenes';

  constructor(private http: HttpClient) {
    super();
  }

  // Método para obtener headers con el token (sin Content-Type para FormData)
  private getHeaders(includeContentType: boolean = true): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    let headers = new HttpHeaders();

    if (includeContentType) {
      headers = headers.set('Accept', 'application/json');
    }

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  delete(entity: ProductoImagen): Observable<any> {
    let params = new HttpParams();
    let url = '';
    if (entity.priId) {
      url = `${this.api}/${entity.priId.toString()}`;
      // params = new HttpParams().set('ID', entity.priId.toString());
      return this.http.delete<any>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  getImagen(fileName: string): Observable<Blob> {
    const url = `${this.api}/imagen/${fileName}`;
    return this.http.get(url, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  find(filter: ProductoImagenFilter): Observable<ProductoImagen[]> {
    const url = `${this.api}/${filter.priId}/${filter.priTimId}`;
    return this.http.get<ProductoImagen[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findById(id: string): Observable<ProductoImagen> {
    const url = `${this.api}/${id}`;
    const params = { priId: id };
    return this.http
      .get<ProductoImagen[]>(url, {
        headers: this.getHeaders(),
      })
      .pipe(map((ele) => ele[0]));
  }

  findByWord(word: string): Observable<any[]> {
    const url = `${this.api}/search-images?q=${word}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  findTipoImagenes(): Observable<any[]> {
    const url = `${this.api}/tipos-imagenes`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  load(filter: ProductoImagenFilter): void {
    this.find(filter).subscribe({
      next: (result) => {
        this.productoImagenList = result;
      },
      error: (err) => {
        console.error('error cargando', err);
      },
    });
  }

  // Crear nueva imagen con archivo
  create(priProId: number, priTimId: number, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('priProId', priProId.toString());
    formData.append('priTimId', priTimId.toString());
    formData.append('imagen', imagen);

    const url = `${this.api}`;
    // No incluir Content-Type, el navegador lo establece automáticamente con el boundary
    return this.http.post<any>(url, formData, {
      headers: this.getHeaders(false),
    });
  }

  // Actualizar imagen existente (con o sin nuevo archivo)
  update(
    priId: number,
    priProId: number,
    priTimId: number,
    imagen?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('priId', priId.toString());
    formData.append('priProId', priProId.toString());
    formData.append('priTimId', priTimId.toString());

    if (imagen) {
      formData.append('imagen', imagen);
    }

    const url = `${this.api}`;
    // No incluir Content-Type, el navegador lo establece automáticamente con el boundary
    return this.http.put<any>(url, formData, {
      headers: this.getHeaders(false),
    });
  }

  // Método genérico save que determina si es crear o actualizar
  save(entity: ProductoImagen, imagen?: File): Observable<any> {
    if (entity.priId && entity.priId > 0) {
      return this.update(
        entity.priId,
        entity.priProId,
        entity.priTimId,
        imagen
      );
    } else {
      if (!imagen) {
        throw new Error('Se requiere una imagen para crear un nuevo registro');
      }
      return this.create(entity.priProId, entity.priTimId, imagen);
    }
  }
}
