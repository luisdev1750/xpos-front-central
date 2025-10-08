import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListaPrecioFilter } from '../lista-precio-filter';
import { ListaPrecioService } from '../lista-precio.service';
import { ListaPrecio } from '../lista-precio';
import { ListaPrecioEditComponent } from '../lista-precio-edit/lista-precio-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-precio',
  standalone: false,
  templateUrl: 'lista-precio-list.component.html',
  styles: [
    'table { }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class ListaPrecioListComponent implements OnInit {
  displayedColumns = [

    'lprNombre',
    'lprActivo',
    'lprFechaVigencia',
    'lprFechaAlta',
    'actions',
  ];
  filter = new ListaPrecioFilter();

  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private listaPrecioService: ListaPrecioService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.listaPrecioService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.lprId = '0';
    this.filter.lprActivo = 'all';
    this.filter.lprFechaVigencia = 'all';
    this.filter.lprFechaAlta = 'all';
  }

  ngOnInit() {
    this.search();
  }
  onFechaAltaChange(event: any) {
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
    onActivoChange(): void {
      this.search();
   }


  /* Accesors */

  get listaPrecioList(): ListaPrecio[] {
    return this.listaPrecioService.listaPrecioList;
  }

  /* Métodos */

  add() {
    let newListaPrecio: ListaPrecio = new ListaPrecio();

    this.edit(newListaPrecio);
  }

  delete(listaPrecio: ListaPrecio): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el lista precios?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.listaPrecioService.delete(listaPrecio).subscribe({
          next: (result) => {
            if (result?.lprId !== undefined && result?.lprId !== null && Number(result.lprId) >= 0) {
              this.toastr.success(
                'El lista precios ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.listaPrecioService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: ListaPrecio) {
    this.dialog.open(ListaPrecioEditComponent, {
      data: { listaPrecio: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.listaPrecioService.load(this.filter);
  }
}
