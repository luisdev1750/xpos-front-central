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
    productos: false,
    promociones: false,
    finanzas: false,
    admin: false,
  };

  // Mapeo de claves de secciones a claves de menú padre
  seccionesClaves = {
    productos: ['CEN_PROD'],        // Categoría: Productos
    promociones: ['CEN_PROM'],      // Categoría: Promociones
    finanzas: ['CEN_FINA'],         // Categoría: Finanzas
    admin: ['CEN_ADMI'],            // Categoría: Administración
  };

  // Mapeo de claves de menú HIJOS por sección
  menusHijos = {
    productos: ['CEN_PROD', 'CEN_FAMI', 'CEN_MARC', 'CEN_SUBM', 'CEN_PRES', 'CEN_PROV', 'CEN_LIST', 'CEN_PREC', 'CEN_PROPR', 'CEN_IMGPRO', 'CEN_PROSUC', 'CEN_STOSUC', 'CEN_PROSUG'],
    promociones: ['CEN_TPROM', 'CEN_PROMO', 'CEN_DPROM', 'CEN_OBSEQ', 'CEN_COMBO', 'CEN_BANN'],
    finanzas: ['CEN_BANC', 'CEN_TASCUO', 'CEN_CTBAN', 'CEN_FORMC'],
    admin: ['CEN_PERF', 'CEN_SUC', 'CEN_CONFSUC', 'CEN_USUA', 'CEN_MENPER']
  };

  constructor(
    private router: Router,
    public permisosService: PermisosService,
    
  ) {}

   isLoginPage(): boolean {
    return this.router.url === '/login';
  }
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
   * Verifica si tiene permiso por clave individual
   */
  tienePermiso(clave: string): boolean {
    return this.permisosService.tienePermisoPorClave(clave);
  }

  /**
   * Verifica si tiene permiso para algún hijo de una sección
   * Retorna true si tiene al menos un permiso de los menús hijos
   */
  tieneAlgunPermisoHijo(seccionKey: string): boolean {
    const claves = (this.menusHijos as any)[seccionKey];
    
    if (!claves || !Array.isArray(claves)) {
      return false;
    }

    // Retorna true si tiene al menos un permiso de los hijos
    return claves.some(clave => this.permisosService.tienePermisoPorClave(clave));
  }
}