import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MenuPerfilService } from '../menu-perfil.service';
import { MenuPerfil } from '../menu-perfil';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-menu-perfil-edit',
  standalone: false,
  templateUrl: './menu-perfil-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
    '.menu-option-content { display: flex; align-items: center; gap: 10px; }',
    '.app-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; min-width: 60px; text-align: center; }',
    '.badge-xpos { background-color: #3f51b5; color: white; }',
    '.badge-central { background-color: #ff9800; color: white; }',
    '.menu-name { flex: 1; }',
  ],
})
export class MenuPerfilEditComponent implements OnInit {
  id!: string;
  menuPerfil!: MenuPerfil;

  listPerfiles: any[] = [];
  listMenus: any[] = [];
  listMenusFiltered: any[] = [];

  // Filtro de aplicación
  appFilter: string = 'TODOS';

  constructor(
    private dialogRef: MatDialogRef<MenuPerfilEditComponent>,
    private menuPerfilService: MenuPerfilService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuPerfil = data.menuPerfil;
    this.listPerfiles = data.listPerfiles;

    if (data.parentPerIdString) {
      this.menuPerfil.mepPerId = data.parentPerIdString;
    }
  }

  ngOnInit() {
    if (this.menuPerfil.mepPerId) {
      this.loadMenus();
    }
  }

  loadMenus() {
    this.menuPerfilService
      .findMenusExcluidos(`${this.menuPerfil.mepPerId}`)
      .subscribe(
        (data) => {
          if (data.length == 0) {
            this.toastr.info(
              'No hay menús disponibles para asignar a este perfil',
              'Información'
            );
            this.listMenus = data;
            this.listMenusFiltered = data;
            return;
          }
          this.listMenus = data;
          this.applyFilter();
          console.log(this.listMenus);
        },
        (error) => {
          this.toastr.error(
            'Ha ocurrido un error al cargar los menús',
            'Error'
          );
        }
      );
  }

  OnPerfilChange(event: any) {
    this.menuPerfil.mepPerId = event.value;

    // Limpiar los filtros y selecciones dependientes
    this.appFilter = 'TODOS';
    this.menuPerfil.mepMenId = 0;
    this.listMenus = [];
    this.listMenusFiltered = [];

    // Cargar nuevos menús
    this.loadMenus();
  }

  OnMenuChange(event: any) {
    this.menuPerfil.mepMenId = event.value;
  }

  OnAppFilterChange(event: any) {
    this.appFilter = event.value;

    this.menuPerfil.mepMenId = 0;

    this.applyFilter();
  }

  applyFilter() {
    if (this.appFilter === 'TODOS') {
      this.listMenusFiltered = this.listMenus;
    } else if (this.appFilter === 'XPOS') {
      this.listMenusFiltered = this.listMenus.filter((menu) =>
        menu.menuClave?.startsWith('MEN_')
      );
    } else if (this.appFilter === 'CENTRAL') {
      this.listMenusFiltered = this.listMenus.filter((menu) =>
        menu.menuClave?.startsWith('CEN_')
      );
    }
  }

  save() {
    this.menuPerfilService.save(this.menuPerfil).subscribe({
      next: (result) => {
        if (
          result?.mepMenId !== undefined &&
          result?.mepMenId !== null &&
          Number(result.mepMenId) >= 0
        ) {
          this.toastr.success(
            'El perfil ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.menuPerfilService.setIsUpdated(true);

          this.menuPerfil.mepMenId = 0;
          if (this.menuPerfil.mepPerId) {
            this.loadMenus();
          }
          // this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
