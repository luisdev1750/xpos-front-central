import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalProdStockFilter } from '../sucursal-prod-stock-filter';
import { SucursalProdStockService } from '../sucursal-prod-stock.service';
import { SucursalProdStock } from '../sucursal-prod-stock';
import { SucursalProdStockEditComponent } from '../sucursal-prod-stock-edit/sucursal-prod-stock-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';
import { ProductoService } from '../../producto/producto.service';

@Component({
  selector: 'app-sucursal-prod-stock',
  standalone: false,
  templateUrl: 'sucursal-prod-stock-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class SucursalProdStockListComponent implements OnInit {
  displayedColumns = [
    'spsSucId',
    'spsProId',
    'spsStockMinimo',
    'spsStockMaximo',
    'actions',
  ];
  filter = new SucursalProdStockFilter();

  private subs!: Subscription;

  /* Inicialización */
  listSucursal: any[] = [];
  listProducto: any[] = [];
  constructor(
    private sucursalProdStockService: SucursalProdStockService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService,
    private productoService: ProductoService
  ) {
    this.subs = this.sucursalProdStockService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.spsSucId = '0';
    this.filter.spsProId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  onSucursalChange(event: any) {}

  loadCatalogs() {
    ////      const url = `${this.api}/${filter.sucId}/${filter.sucCiuId}/${filter.sucColId}/${filter.sucEmpId}`;
    this.sucursalService.findAll().subscribe(
      (result) => {
        // this.sucursalService.sucursalList = result;
        console.log(result);
        this.listSucursal = result;
      },
      (error) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );

    //  this.productoService
    //    .find({
    //      proId: '0',
    //      proFamId: '0',
    //      proPreId: '0',
    //      proActivo: 'all',
    //    })
    //    .subscribe(
    //      (result) => {
    //        console.log(result);
    //        this.listProducto = result;
    //      },
    //      (error) => {
    //        this.toastr.error('Ha ocurrido un error', 'Error');
    //      }
    //    );
  }

  /* Accesors */

  get sucursalProdStockList(): SucursalProdStock[] {
    return this.sucursalProdStockService.sucursalProdStockList;
  }

  /* Métodos */

  add() {
    let newSucursalProdStock: SucursalProdStock = new SucursalProdStock();

    this.edit(newSucursalProdStock);
  }

  delete(sucursalProdStock: SucursalProdStock): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el sucursal productos stock?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sucursalProdStockService.delete(sucursalProdStock).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El sucursal productos stock ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.sucursalProdStockService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: SucursalProdStock) {
    var temporalList: any[] = [];
/////Creación nuevo elemento
    if (!ele.spsSucId) {
      this.dialog.open(SucursalProdStockEditComponent, {
        data: {
          sucursalProdStock: JSON.parse(JSON.stringify(ele)),
          listSucursal: this.listSucursal,
          listProducto: [],
          isReadOnly: false,
        },
        height: '500px',
        width: '700px',
        maxWidth: 'none',
        disableClose: true,
      });
      return;
    }

////Actualización
    this.sucursalProdStockService

      .findCatalog(ele.spsSucId ? ele.spsSucId : 0)
      .subscribe(
        (result) => {
          console.log('RESULTS:');

          console.log(result);
          temporalList = result;
          this.dialog.open(SucursalProdStockEditComponent, {
            data: {
              sucursalProdStock: JSON.parse(JSON.stringify(ele)),
              listSucursal: this.listSucursal,
              listProducto: result,
              isReadOnly: true, 
            },
            height: '500px',
            width: '700px',
            maxWidth: 'none',
            disableClose: true,
          });
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
  }

  search(): void {
    this.sucursalProdStockService.load(this.filter);
  }
}
