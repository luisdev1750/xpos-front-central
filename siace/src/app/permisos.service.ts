import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GeneralService } from './common/general.service';

export interface Permiso {
  mepPerId: number;
  mepMenId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends GeneralService {
  private api = this.sUrl + 'Permisos';
  private permisosSubject = new BehaviorSubject<number[]>([]);
  public permisos$ = this.permisosSubject.asObservable();

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
   * Carga los permisos del perfil desde el API
   */
  cargarPermisos(perfilId: number): Observable<Permiso[]> {
    const url = `${this.api}/${perfilId}`;
    return this.http.get<Permiso[]>(url, {
      headers: this.getHeaders()
    }).pipe(
      tap(permisos => {
        // Extraer solo los IDs de menú y almacenarlos
        const menuIds = permisos.map(p => p.mepMenId);
        this.permisosSubject.next(menuIds);
        // También guardar en localStorage para persistencia
        localStorage.setItem('permisos', JSON.stringify(menuIds));
      })
    );
  }

  /**
   * Obtiene los permisos desde localStorage (para cuando se recarga la página)
   */
  obtenerPermisosLocales(): number[] {
    const permisosStr = localStorage.getItem('permisos');
    if (permisosStr) {
      const permisos = JSON.parse(permisosStr);
      this.permisosSubject.next(permisos);
      console.log("permisos locales:");
      console.log(permisosStr);
        console.log();
        
      
      return permisos;
    }
    return [];
  }

  /**
   * Verifica si el usuario tiene permiso para un menú específico
   */
  tienePermiso(menuId: number): boolean {
    return this.permisosSubject.value.includes(menuId);
  }

  /**
   * Verifica si tiene permiso para alguno de los menús de una sección
   */
  tienePermisoSeccion(menuIds: number[]): boolean {
    return menuIds.some(id => this.tienePermiso(id));
  }

  /**
   * Limpia los permisos (útil para logout)
   */
  limpiarPermisos(): void {
    this.permisosSubject.next([]);
    localStorage.removeItem('permisos');
  }
}