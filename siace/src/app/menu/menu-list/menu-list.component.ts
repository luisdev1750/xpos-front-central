// menu.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: []
})
export class MenuListComponent implements OnInit {
  
  isMenuOpen = true;
  expandedSections: { [key: string]: boolean } = {
    catalogos: false,
    sucursales: false,
    precios: false,
    finanzas: false,
    admin: false,
    multimedia: false
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Detectar si es dispositivo móvil al cargar
    this.checkScreenSize();
    
    // Mantener el menú abierto en desktop después de navegar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // En móvil, cerrar el menú al navegar
      if (window.innerWidth <= 768) {
        this.isMenuOpen = false;
      }
      // En desktop, mantener el estado actual del menú
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
    } else {
      this.isMenuOpen = true;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  // Cerrar menú solo en móvil al hacer clic en un link
  onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
    }
  }
}