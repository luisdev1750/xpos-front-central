import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'siga';
  
  isMenuOpen = false; // 👈 Cambiado a false para iniciar cerrado
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
    // El menú siempre inicia cerrado
    this.isMenuOpen = false;
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Cerrar el menú al navegar
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
}