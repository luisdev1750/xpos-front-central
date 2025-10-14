import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PermisosService } from './permisos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'siga';

  isMenuOpen = false;
  expandedSections: { [key: string]: boolean } = {
    catalogos: false,
    sucursales: false,
    precios: false,
    finanzas: false,
    admin: false,
    multimedia: false,
  };

  // Mapeo de claves de secciones a claves de menú
  seccionesClaves = {
    productos: ['CEN_PROD'],        // Categoría: Productos
    promociones: ['CEN_PROM'],      // Categoría: Promociones
    finanzas: ['CEN_FINA'],         // Categoría: Finanzas
    admin: ['CEN_ADMI'],            // Categoría: Administración
  };

  // IDs de menú por clave (para menús individuales no agrupados)
  menuClaves = {
    login: 'LOGIN',
    productoProveedor: 'PROD_PROV',
  };

  constructor(
    private router: Router,
    public permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.permisosService.obtenerPermisosLocales();

    this.isMenuOpen = false;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.isMenuOpen = false;
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // No hacer nada en resize, mantener el estado actual
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
    }
  }

  /**
   * Verifica si tiene permiso por clave
   */
  tienePermiso(clave: string): boolean {
    return this.permisosService.tienePermisoPorClave(clave);
  }

  /**
   * Verifica si tiene permiso para una sección completa
   */
  tienePermisoSeccion(seccionKey: string): boolean {
    const claves = (this.seccionesClaves as any)[seccionKey];
    
    if (!claves) {
      console.warn(`Sección desconocida: ${seccionKey}`);
      return false;
    }

    return this.permisosService.tienePermisoSeccion(claves);
  }
}