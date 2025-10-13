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

  // IDs de menú según comentarios en tu HTML
  menuIds = {
    login: 1,

    productos: 2,
    marcas: 3,
    submarcas: 4,
    familias: 5,
    presentaciones: 6,
    bancos: 7,
    proveedores: 8,
    sucursales: 9,
    sucursalConfiguracion: 10,
    sucursalProducto: 11,
    sucursalProdStock: 12,

    listaPrecio: 13,
    productoPrecio: 14,
    promocion: 15,
    tipoPromocion: 16,
    promocionDetalle: 17,
    promocionObsequio: 18,
    combo: 19,

    cuentaBancaria: 20,
    tasaCuota: 21,
    formulaContable: 22,

    usuario: 23,
    perfil: 24,
    menuPerfil: 25,

    productoImagen: 26,
    banner: 27,

    productoProveedor: 41,
  };

  // IDs de secciones
  seccionIds = {
    catalogos: 34,
    sucursales: 35,
    precios: 36,
    finanzas: 37,
    admin: 38,
    multimedia: 39,
  };

  constructor(
    private router: Router,
    public permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    // Cargar permisos desde localStorage al iniciar
    this.permisosService.obtenerPermisosLocales();

    this.isMenuOpen = false;
    const permisosStr = localStorage.getItem('permisos');
    console.log('permisos str');

    console.log(permisosStr);

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

  // Métodos auxiliares para verificar permisos
  tienePermiso(menuId: number): boolean {
    return this.permisosService.tienePermiso(menuId);
  }

  tienePermisoSeccion(seccionKey: string): boolean {
    // Obtener el ID de la sección según su clave
    const seccionId = (this.seccionIds as any)[seccionKey];

    // Si no existe esa clave en seccionIds, retorna false
    if (!seccionId) return false;

    // Leer permisos del localStorage
    const permisosStr = localStorage.getItem('permisos');
    if (!permisosStr) return false;

    // Parsear el array de permisos
    let permisos: number[] = [];
    try {
      permisos = JSON.parse(permisosStr);
    } catch (e) {
      console.error('Error al parsear permisos:', e);
      return false;
    }

    // Revisar si el ID de la sección está dentro del arreglo
    return permisos.includes(seccionId);
  }
}
