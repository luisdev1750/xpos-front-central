import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasaCuotaFilter } from '../tasa-cuota-filter';
import { TasaCuotaService } from '../tasa-cuota.service';
import { TasaCuota } from '../tasa-cuota';
import { TasaCuotaEditComponent } from '../tasa-cuota-edit/tasa-cuota-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasa-cuota',
  standalone: false,
  templateUrl: 'tasa-cuota-list.component.html',
  styles: ['table {}', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class TasaCuotaListComponent implements OnInit {
  displayedColumns = [
    'tocId',
    'tocTasaocuota',
    'tocImpId',
    'tocTfaId',
    'tocTraslado',
    'tocRetencion',
    'tocActivo',
    'actions',
  ];
  filter = new TasaCuotaFilter();
  listImpuestosFilter: any[] = [];
  listTiposFactoresFilter: any[] = [];
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private tasaCuotaService: TasaCuotaService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.tasaCuotaService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.tocId = '0';
    this.filter.tocImpId = '0';
    this.filter.tocTfaId = '0';
    this.filter.tocActivo = 'all';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogos();
  }
  OnActivoChange(): void {
    this.search();
  }
  OnMarcaChange(event: any) {
    this.filter.tocImpId = event.value;
    this.search();
  }
  OnFactorChange(event: any) {
    this.filter.tocTfaId = event.value;
    this.search();
  }
  loadCatalogos() {
    this.tasaCuotaService.findCatalog('impuestos').subscribe({
      next: (result) => {
        this.listImpuestosFilter = result;
        console.log(result);
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
    this.tasaCuotaService.findCatalog('tiposfactores').subscribe({
      next: (result) => {
        console.log(result);
        this.listTiposFactoresFilter = result;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get tasaCuotaList(): TasaCuota[] {
    return this.tasaCuotaService.tasaCuotaList;
  }

  /* Métodos */

  add() {
    let newTasaCuota: TasaCuota = new TasaCuota();

    this.edit(newTasaCuota);
  }

  delete(tasaCuota: TasaCuota): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el tasa o cuota?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.tasaCuotaService.delete(tasaCuota).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El tasa o cuota ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.tasaCuotaService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: TasaCuota) {
    this.dialog.open(TasaCuotaEditComponent, {
      data: { tasaCuota: JSON.parse(JSON.stringify(ele)) ,
         listImpuestosFilter: this.listImpuestosFilter,
         listTiposFactoresFilter: this.listTiposFactoresFilter
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.tasaCuotaService.load(this.filter);
  }
}
