import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromocionDetalleFilter } from '../promocion-detalle-filter';
import { PromocionDetalleService } from '../promocion-detalle.service';
import { PromocionDetalle } from '../promocion-detalle';
import { PromocionDetalleEditComponent } from '../promocion-detalle-edit/promocion-detalle-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TipoPromocion } from '../../tipo-promocion/tipo-promocion';
import { ProductoService } from '../../producto/producto.service';
import { FamiliaService } from '../../familia/familia.service';
import { TipoPromocionService } from '../../tipo-promocion/tipo-promocion.service';

@Component({
  selector: 'app-promocion-detalle',
  standalone: false,
  templateUrl: 'promocion-detalle-list.component.html',
  styles: [
    'table { min-width: 600px }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class PromocionDetalleListComponent implements OnInit {
  displayedColumns = [
    'prdId',
    'prdPmoId',
    'prdProId',
    'prdFamId',
    'prdPreId',
    'prdProcentajeDescuento',
    'prdNxmProdCompra',
    'prdNxmProdObsequio',
    'actions',
  ];
  filter = new PromocionDetalleFilter();

  private subs!: Subscription;
  familiaList: any[] = [];
  /* Inicialización */

  constructor(
    private promocionDetalleService: PromocionDetalleService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private promocionService: TipoPromocionService,
    private productoServie: ProductoService,
    private familiaService: FamiliaService
  ) {
    this.subs = this.promocionDetalleService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.prdId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    this.promocionService
      .find({
        tprId: '0',
        tprActivo: 'all',
      })
      .subscribe(
        (result) => {
          //   this.promocionService.tipoPromocionList = result;
          console.log("promocion");
          
          console.log(result);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
    ///  const url = `${this.api}/${filter.proId}/${filter.proFamId}/${filter.proPreId}/${filter.proActivo}`;
    this.productoServie
      .find({
        proId: '0',
        proFamId: '0',
        proPreId: '0',
        proActivo: 'all',
      })
      .subscribe(
        (result) => {
          this.productoServie.productoList = result;
             console.log("producto");
          
          console.log(result);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
    /////  const url = `${this.api}/${filter.famId}/${filter.famSmaId}/${filter.famIdParent}`;
    this.familiaService
      .find({
        famId: '0',
        famSmaId: '0',
        famIdParent: '0',
      })
      .subscribe(
        (result) => {
          // this.familiaService.familiaList = result;
          this.familiaList = result; 
             console.log("familia");
          
          console.log(result);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
  }
  /* Accesors */

  get promocionDetalleList(): PromocionDetalle[] {
    return this.promocionDetalleService.promocionDetalleList;
  }

  /* Métodos */

  add() {
    let newPromocionDetalle: PromocionDetalle = new PromocionDetalle();

    this.edit(newPromocionDetalle);
  }

  delete(promocionDetalle: PromocionDetalle): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el detalle de promoción?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.promocionDetalleService.delete(promocionDetalle).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El detalle de promoción ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.promocionDetalleService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: PromocionDetalle) {
    this.dialog.open(PromocionDetalleEditComponent, {
      data: { promocionDetalle: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.promocionDetalleService.load(this.filter);
  }
}
