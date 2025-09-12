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
  ],
})
export class MenuPerfilEditComponent implements OnInit {
  id!: string;
  menuPerfil!: MenuPerfil;

  listPerfiles: any[] = [];
  listMenus: any[] = [];

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<MenuPerfilEditComponent>,
    private menuPerfilService: MenuPerfilService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuPerfil = data.menuPerfil;
    this.listPerfiles = data.listPerfiles;
 
   if(data.parentPerIdString){
       this.menuPerfil.mepPerId = data.parentPerIdString;
   }
  }

  ngOnInit() {
    if (this.menuPerfil.mepPerId) {
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
              return;
            }
            this.listMenus = data;
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
  }

  OnPerfilChange(event: any) {
    this.menuPerfil.mepPerId = event.value;
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
            return;
          }
          this.listMenus = data;
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

  OnMenuChange(event: any) {
    console.log('---------here----');

    this.menuPerfil.mepMenId = event.value;
  }
  /*Métodos*/

  save() {
    this.menuPerfilService.save(this.menuPerfil).subscribe({
      next: (result) => {
        ///   if (result?.banId !== undefined && result?.banId !== null && Number(result.banId) >= 0) {
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
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
