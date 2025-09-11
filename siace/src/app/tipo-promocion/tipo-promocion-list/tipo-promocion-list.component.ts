import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TipoPromocionFilter } from '../tipo-promocion-filter';
import { TipoPromocionService } from '../tipo-promocion.service';
import { TipoPromocion } from '../tipo-promocion';
import { TipoPromocionEditComponent } from '../tipo-promocion-edit/tipo-promocion-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipo-promocion',
  standalone: false,
  templateUrl: 'tipo-promocion-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class TipoPromocionListComponent implements OnInit {
  displayedColumns = ['tprId', 'tprNombre', 'tprActivo', 'tprClave', 'actions'];
  filter = new TipoPromocionFilter();

  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private tipoPromocionService: TipoPromocionService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.tipoPromocionService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.tprId = '0';
    this.filter.tprActivo = 'all';
  }

  ngOnInit() {
    this.search();
  }

  OnActivoChange() {
    this.search();
  }
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get tipoPromocionList(): TipoPromocion[] {
    return this.tipoPromocionService.tipoPromocionList;
  }

  /* Métodos */

  add() {
    let newTipoPromocion: TipoPromocion = new TipoPromocion();

    this.edit(newTipoPromocion);
  }

  delete(tipoPromocion: TipoPromocion): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el tipo de promoción?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.tipoPromocionService.delete(tipoPromocion).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El tipo de promoción ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.tipoPromocionService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: TipoPromocion) {
    this.dialog.open(TipoPromocionEditComponent, {
      data: { tipoPromocion: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.tipoPromocionService.load(this.filter);
  }
}
