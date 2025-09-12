import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuPerfilFilter } from '../menu-perfil-filter';
import { MenuPerfilService } from '../menu-perfil.service';
import { MenuPerfil } from '../menu-perfil';
import { MenuPerfilEditComponent } from '../menu-perfil-edit/menu-perfil-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../perfil/perfil.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-menu-perfil',
  standalone: false,
  templateUrl: 'menu-perfil-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class MenuPerfilListComponent implements OnInit {
  displayedColumns = ['mepPerId', 'mepMenId', 'actions'];
  filter = new MenuPerfilFilter();
  perfilControl = new FormControl('0');
  private subs!: Subscription;
  listPerfiles: any[] = [];
  /* Inicialización */
  parentPerIdString: string = '0';
  constructor(
    private menuPerfilService: MenuPerfilService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private perfilService: PerfilService,
    private route: ActivatedRoute
  ) {
    //  this.subs = this.menuPerfilService.getIsUpdated().subscribe(() => {
    //    this.search();
    //  });

    this.filter.mepPerId = '0';
    this.filter.mepMenId = '0';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.filter.mepPerId = id;
        this.parentPerIdString = id;
      }
      this.search();
      this.loadCatalogs();
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  loadCatalogs() {
    this.perfilService
      .find({
        perId: '0',
        perActivo: 'all',
        perNombre: 'all',
      })
      .subscribe(
        (data) => {
          console.log(data);

          this.listPerfiles = data;
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
  }

  OnChangePerfil(event: any) {
    this.filter.mepPerId = event.value;
    this.search();
  }

  /* Accesors */

  get menuPerfilList(): MenuPerfil[] {
    return this.menuPerfilService.menuPerfilList;
  }

  /* Métodos */

  add() {
    let newMenuPerfil: MenuPerfil = new MenuPerfil();

    this.edit(newMenuPerfil);
  }

  delete(menuPerfil: MenuPerfil): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el perfil?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.menuPerfilService.delete(menuPerfil).subscribe({
          next: (result) => {
            if (
              result?.menuId !== undefined &&
              result?.menuId !== null &&
              Number(result.menuId) >= 0
            ) {
              this.toastr.success(
                'El perfil ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.menuPerfilService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: MenuPerfil) {
    this.dialog.open(MenuPerfilEditComponent, {
      data: {
        menuPerfil: JSON.parse(JSON.stringify(ele)),
        listPerfiles: this.listPerfiles,
        PerfilIdParent: this.filter.mepPerId,
        parentPerIdString: Number(this.parentPerIdString),
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.menuPerfilService.load(this.filter);
  }
}
