import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from '../common/general.service';

@Injectable()
export class ProductoSugeridoService extends GeneralService {
  private isUpdatedSubject = new BehaviorSubject<boolean>(false);
  api = this.sUrl + 'SucursalesProductosSugeridos';

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



  /**
   * Obtiene lista de productos con sugerencias configuradas
   * GET /api/SucursalesProductosSugeridos/{sucId}/{activo}
   */
  find(filter: { sucId: string; activo: string }): Observable<any[]> {
    const url = `${this.api}/${filter.sucId}/${filter.activo}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene detalle completo de sugerencias para un producto específico
   * GET /api/SucursalesProductosSugeridos/detalle/{sucId}/{proId}/{lprId}
   */
  findDetalle(sucId: number, proId: number, lprId: number): Observable<any> {
    const url = `${this.api}/detalle/${sucId}/${proId}/${lprId}`;
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene productos de una sucursal que NO tienen sugerencias configuradas
   * GET /api/SucursalesProductosSugeridos/productos-disponibles/{sucId}
   */
  findProductosDisponibles(sucId: number): Observable<any[]> {
    const url = `${this.api}/productos-disponibles/${sucId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtiene productos que pueden ser sugeridos (excluye el producto actual)
   * GET /api/SucursalesProductosSugeridos/productos-sugeribles/{sucId}/{proId}/{lprId}
   */
  findProductosSugeribles(sucId: number, proId: number, lprId: number): Observable<any[]> {
    const url = `${this.api}/productos-sugeribles/${sucId}/${proId}/${lprId}`;
    return this.http.get<any[]>(url, {
      headers: this.getHeaders()
    });
  }

  /**
   * Crea o actualiza producto con sus sugerencias
   * POST /api/SucursalesProductosSugeridos (crear)
   * PUT /api/SucursalesProductosSugeridos (actualizar)
   */
  save(entity: any, isEditMode: boolean): Observable<any> {
    const url = `${this.api}`;
    const headers = this.getHeaders();
    
    // Si tiene datos completos, determinar si es actualización o creación
    // En este caso, siempre verificamos si ya existe para decidir PUT o POST
    if (isEditMode) {
      // Intentar como actualización primero
      return this.http.put<any>(url, entity, { headers });
    } else {
      return this.http.post<any>(url, entity, { headers });
    }
  }

  /**
   * Elimina todas las sugerencias de un producto
   * DELETE /api/SucursalesProductosSugeridos/{sucId}/{proId}/{lprId}
   */
  delete(sucId: number, proId: number, lprId: number): Observable<any> {
    const url = `${this.api}/${sucId}/${proId}/${lprId}`;
    return this.http.delete<any>(url, {
      headers: this.getHeaders()
    });
  }
}