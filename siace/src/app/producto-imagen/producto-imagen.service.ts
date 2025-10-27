import { ProductoImagen } from './producto-imagen';
import { ProductoImagenFilter } from './producto-imagen-filter';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GeneralService } from '../common/general.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductoImagenService extends GeneralService {
  productoImagenList: ProductoImagen[] = [];
  api = this.sUrl + 'ProductosImagenes';
  private isUpdatedSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {
    super();
  }

  // Método para obtener headers con el token
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



  // NUEVO: Método para obtener productos agrupados con sus imágenes
  findAgrupados(filter: ProductoImagenFilter): Observable<any[]> {
    const url = `${this.api}/agrupados/${filter.priTimId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders(),
    });
  }

  // NUEVO: Guardar múltiples imágenes en lote
  saveBatch(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('proId', data.proId.toString());
    
    // Preparar array de tipos y archivos
    const imagenesData: any[] = [];
    const nuevasImagenes: File[] = [];
    
    data.imagenes.forEach((img: any, index: number) => {
      imagenesData.push({
        tipoId: img.tipoId,
        tipoNombre: img.tipoNombre,
        isNew: img.isNew,
        nombreArchivo: img.nombreArchivo || null,
        index: img.isNew ? nuevasImagenes.length : -1
      });
      
      if (img.isNew && img.archivo) {
        nuevasImagenes.push(img.archivo);
      }
    });
    
    // Agregar JSON con metadata
    formData.append('imagenesData', JSON.stringify(imagenesData));
    
    // Agregar archivos nuevos
    nuevasImagenes.forEach((archivo, index) => {
      formData.append(`imagenes`, archivo);
    });

    const url = `${this.api}/batch`;
    return this.http.post<any>(url, formData, {
      headers: this.getHeaders(false),
    });
  }

  // NUEVO: Eliminar todas las imágenes de un producto
  deleteByProducto(proId: number): Observable<any> {
    const url = `${this.api}/producto/${proId}`;
    return this.http.delete<any>(url, {
      headers: this.getHeaders(),
    });
  }

  // Mantener métodos existentes para compatibilidad
  delete(entity: ProductoImagen): Observable<any> {
    let params = new HttpParams();
    let url = '';
    if (entity.priId) {
      url = `${this.api}/${entity.priId.toString()}`;
      return this.http.delete<any>(url, {
        headers: this.getHeaders(),
        params,
      });
    }
    return EMPTY;
  }

  getImagen(priProId: number, fileName: string): Observable<Blob> {
    const url = `${this.api}/imagen/${priProId}/${fileName}`;
    return this.http.get(url, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  // NUEVO: Obtener imagen como Data URL (Base64) para usar en <img src>
  getImagenAsDataUrl(priProId: number, fileName: string): Observable<string> {
    return this.getImagen(priProId, fileName).pipe(
      map((blob: Blob) => {
        return URL.createObjectURL(blob);
      })
    );
  }

  getImageUrl(priProId: number, fileName: string): string {
    return `${this.api}/imagen/${priProId}/${fileName}`;
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

  findAllProductosImagenes(): Observable<any[]> {
    const url = `${this.api}/all-productos-imagenes`;
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

  // Métodos antiguos - mantener para compatibilidad pero marcar como deprecated
  create(priProId: number, priTimId: number, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('priProId', priProId.toString());
    formData.append('priTimId', priTimId.toString());
    formData.append('imagen', imagen);

    const url = `${this.api}`;
    return this.http.post<any>(url, formData, {
      headers: this.getHeaders(false),
    });
  }

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
    return this.http.put<any>(url, formData, {
      headers: this.getHeaders(false),
    });
  }

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