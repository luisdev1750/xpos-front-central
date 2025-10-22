import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioFilter } from '../usuario-filter';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario';
import { UsuarioEditComponent } from '../usuario-edit/usuario-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../perfil/perfil.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { Perfil } from '../../perfil/perfil';
import { Sucursal } from '../../sucursal/sucursal';
// En usuario-list.component.ts (no debería ser necesario, pero por si acaso)
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: 'usuario-list.component.html',
  styles: [
    'table { }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class UsuarioListComponent implements OnInit {
  displayedColumns = [

    'usuNombre',
    'usuUser',

    'usuCorreoElectronico',
    'usuPerId',
    'usuSucId',
    'usuActivo',
    'usuFechaAlta',
    'usuFecha_Modificacion',
    'actions',
  ];
  filter = new UsuarioFilter();

  private subs!: Subscription;

  /* Inicialización */
  perfilListsFilter: Perfil[] = [];
  sucursalListsFilter: Sucursal[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private perfilService: PerfilService,
    private sucursalService: SucursalService
  ) {
    this.subs = this.usuarioService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.usuId = '0';
    this.filter.usuPerId = '0';
    this.filter.usuSucId = '0';
    this.filter.usuActivo = 'all';
  }

  ngOnInit() {
    this.loadCatalogos();
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  onActivoChange() {
    this.search();
  }
  onPerfilChange(event: any) {
    this.filter.usuPerId = event.value;
    this.search();
  }
  onSucursalChange(event: any) {
    this.filter.usuSucId = event.value;
    this.search();
  }
  loadCatalogos() {
    this.perfilService
      .find({
        perId: '0',
        perActivo: 'all',
        perNombre: 'all',
      })
      .subscribe((result) => {
        console.log('result', result);
        this.perfilListsFilter = result;
      });

    this.sucursalService.findAll().subscribe((result) => {
      console.log('result', result);
      this.sucursalListsFilter = result;
    });
  }

  /* Accesors */

  get usuarioList(): Usuario[] {
    return this.usuarioService.usuarioList;
  }

  /* Métodos */

  add() {
    let newUsuario: Usuario = new Usuario();

    this.edit(newUsuario);
  }

  delete(usuario: Usuario): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el usuario?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.usuarioService.delete(usuario).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El usuario ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.usuarioService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Usuario) {
    this.dialog.open(UsuarioEditComponent, {
      data: {
        usuario: JSON.parse(JSON.stringify(ele)),
        sucursalListsFilter: this.sucursalListsFilter,
         perfilListsFilter: this.perfilListsFilter,
      },

      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.usuarioService.load(this.filter);
  }
}
