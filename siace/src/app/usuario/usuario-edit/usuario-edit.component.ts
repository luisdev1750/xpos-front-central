import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Perfil } from '../../perfil/perfil';
import { Sucursal } from '../../sucursal/sucursal';

@Component({
  selector: 'app-usuario-edit',
  standalone: false,
  templateUrl: './usuario-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class UsuarioEditComponent implements OnInit {
  id!: string;
  usuario!: Usuario;
  perfilListsFilter: Perfil[] = [];
  sucursalListsFilter: Sucursal[] = [];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<UsuarioEditComponent>,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.usuario = data.usuario;
    this.perfilListsFilter = data.perfilListsFilter;
    this.sucursalListsFilter = data.sucursalListsFilter;
  }
  onSucursalChange(event: any) {
    this.usuario.usuSucId = event.value;
  }
  onPerfilChange(event: any) {
    this.usuario.usuPerId = event.value;
  }
  ngOnInit() {}

  onActivoChange(event: any) {
    this.usuario.usuActivo = event.value;
  }
  /*Métodos*/

  save() {
    this.usuarioService.save(this.usuario).subscribe({
      next: (result) => {
        if (
          result?.usuId !== undefined &&
          result?.usuId !== null &&
          Number(result.usuId) >= 0
        ) {
          this.toastr.success(
            'El usuario ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.usuarioService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
