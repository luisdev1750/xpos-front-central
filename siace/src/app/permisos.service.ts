import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GeneralService } from './common/general.service';

export interface Permiso {
  mepPerId: number;
  mepMenId: number;
  mepMenClave: string;
}

export interface PermisoMap {
  [key: string]: number; // clave -> mepMenId
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends GeneralService {
  private api = this.sUrl + 'Permisos';
  
  // Almacenar mapeo de claves a IDs
  private permisoMapSubject = new BehaviorSubject<PermisoMap>({});
  public permisoMap$ = this.permisoMapSubject.asObservable();
  
  // Almacenar lista de permisos para compatibilidad
  private permisosSubject = new BehaviorSubject<number[]>([]);
  public permisos$ = this.permisosSubject.asObservable();

  constructor(private http: HttpClient) {
    super();
  }

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
        // Crear mapeo de claves a IDs
        const permisoMap: PermisoMap = {};
        const menuIds: number[] = [];
        
        permisos.forEach(p => {
          permisoMap[p.mepMenClave] = p.mepMenId;
          menuIds.push(p.mepMenId);
        });
        
        this.permisoMapSubject.next(permisoMap);
        this.permisosSubject.next(menuIds);
        
        // Guardar en localStorage
        localStorage.setItem('permisoMap', JSON.stringify(permisoMap));
        localStorage.setItem('permisos', JSON.stringify(menuIds));
      })
    );
  }

  /**
   * Obtiene los permisos desde localStorage (para cuando se recarga la página)
   */
  obtenerPermisosLocales(): void {
    const permisoMapStr = localStorage.getItem('permisoMap');
    const permisosStr = localStorage.getItem('permisos');
    
    if (permisoMapStr) {
      try {
        const permisoMap = JSON.parse(permisoMapStr);
        this.permisoMapSubject.next(permisoMap);
      } catch (e) {
        console.error('Error al parsear permisoMap:', e);
      }
    }
    
    if (permisosStr) {
      try {
        const permisos = JSON.parse(permisosStr);
        this.permisosSubject.next(permisos);
      } catch (e) {
        console.error('Error al parsear permisos:', e);
      }
    }
  }

  /**
   * Verifica si el usuario tiene permiso por clave (RECOMENDADO)
   */
  tienePermisoPorClave(clave: string): boolean {
    const permisoMap = this.permisoMapSubject.value;
    return clave in permisoMap;
  }

  /**
   * Verifica si el usuario tiene permiso para un menú específico (por ID)
   */
  tienePermiso(menuId: number): boolean {
    return this.permisosSubject.value.includes(menuId);
  }

  /**
   * Verifica si tiene permiso para alguna de las claves
   */
  tienePermisoSeccion(claves: string[]): boolean {
    return claves.some(clave => this.tienePermisoPorClave(clave));
  }

  /**
   * Obtener el mepMenId por clave
   */
  obtenerIdPorClave(clave: string): number | undefined {
    return this.permisoMapSubject.value[clave];
  }

  /**
   * Obtener todas las claves de permisos
   */
  obtenerTodasLasClaves(): string[] {
    return Object.keys(this.permisoMapSubject.value);
  }

  /**
   * Limpia los permisos (útil para logout)
   */
  limpiarPermisos(): void {
    this.permisoMapSubject.next({});
    this.permisosSubject.next([]);
    localStorage.removeItem('permisoMap');
    localStorage.removeItem('permisos');
  }
}