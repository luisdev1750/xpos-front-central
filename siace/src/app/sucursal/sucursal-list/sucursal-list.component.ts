import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalFilter } from '../sucursal-filter';
import { SucursalService } from '../sucursal.service';
import { Sucursal } from '../sucursal';
import { SucursalEditComponent } from '../sucursal-edit/sucursal-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sucursal',
  standalone: false,
  templateUrl: 'sucursal-list.component.html',
  styles: [
    'table { min-width: 600px }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class SucursalListComponent implements OnInit {
  displayedColumns = [
    'sucId',
    'sucNombre',
    'sucNumero',
    'sucCalle',
    'sucNumeroExterior',
    'sucNumeroInterior',
    'sucLatitud',
    'sucLongitud',
    'sucCiuId',
    'sucColId',
    'sucEmpId',
    'actions',
  ];
  filter = new SucursalFilter();

  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private sucursalService: SucursalService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.sucursalService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.sucId = '0';
  }

  ngOnInit() {
    this.loadCatalogs();
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    this.sucursalService.findAllCities().subscribe(
      (res) => {
        console.log('Respuesta cities');
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /* Accesors */

  get sucursalList(): Sucursal[] {
    return this.sucursalService.sucursalList;
  }

  /* Métodos */

  add() {
    let newSucursal: Sucursal = new Sucursal();

    this.edit(newSucursal);
  }

  delete(sucursal: Sucursal): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el sucursal?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sucursalService.delete(sucursal).subscribe({
          next: (result) => {
            if (
              result?.sucId != null &&
              result?.sucId != undefined &&
              result?.sucId > 0
            ) {
              this.toastr.success(
                'El sucursal ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.sucursalService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Sucursal) {
    this.dialog.open(SucursalEditComponent, {
      data: { sucursal: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.sucursalService.load(this.filter);
  }
}
