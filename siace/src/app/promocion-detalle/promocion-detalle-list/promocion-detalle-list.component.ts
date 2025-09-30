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
import { ActivatedRoute } from '@angular/router';
import { PromocionService } from '../../promocion/promocion.service';
import { Promocion } from '../../promocion/promocion';

@Component({
  selector: 'app-promocion-detalle',
  standalone: false,
  templateUrl: 'promocion-detalle-list.component.html',
  styles: [
    'table { }',
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
  promocionId: string = '';
  sucursalId: string = '';
  tipoPromocionId: string = '';
  promocionCurrent: Promocion = new Promocion();
  private subs!: Subscription;
  familiaList: any[] = [];
  /* Inicialización */

  constructor(
    private promocionDetalleService: PromocionDetalleService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private promocionService: TipoPromocionService,
    private productoServie: ProductoService,
    private familiaService: FamiliaService,
    private route: ActivatedRoute,
    private promocionServiceController: PromocionService
  ) {
    this.subs = this.promocionDetalleService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.prdId = '0';
  }

  async ngOnInit() {
   

    await this.getParams();
    this.loadCatalogs();
     this.search();
  }

  getParams() {
    this.route.params.subscribe((params) => {
      this.promocionId = params['id'];
      console.log('Id de promoción');
      console.log(this.promocionId);
      this.filter.prdPmoId = this.promocionId; 
    });

    this.route.queryParams.subscribe((params) => {
      this.tipoPromocionId = params['tipoPromocion'];
      console.log('Tipo promoción:', this.sucursalId);
    });

    this.route.queryParams.subscribe((params) => {
      this.sucursalId = params['sucursalId'];
      console.log('Sucursal recibida:', this.sucursalId);
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    console.log('Promo id: :::::');
    console.log(this.promocionId);

    this.promocionDetalleService
      .find({
        prdId: '',
        prdPmoId: this.promocionId,
        prdProId: '',
        prdFamId: '',
        prdPreId: '',
      })
      .subscribe(
        (res) => {
          console.log('Info de la promoción:');
          console.log(res);

        },
        (error) => {
          console.log('error');
          console.log(error);
        }
      );
    this.promocionService
      .find({
        tprId: '0',
        tprActivo: 'all',
      })
      .subscribe(
        (result) => {
          console.log('Tipo de promociones lista: ');
          this.promocionService.tipoPromocionList = result;

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
          console.log('producto');

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
          console.log('familia');

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
      data: {
        promocionDetalle: JSON.parse(JSON.stringify(ele)),
        promocionId: this.promocionId,
        tipoPromocionId: this.tipoPromocionId,
        sucursalId: this.sucursalId,
      },
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
