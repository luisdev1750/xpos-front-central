import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoPrecioFilter } from '../producto-precio-filter';
import { ProductoPrecioService } from '../producto-precio.service';
import { ProductoPrecio } from '../producto-precio';
import { ProductoPrecioEditComponent } from '../producto-precio-edit/producto-precio-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ListaPrecioService } from '../../lista-precio/lista-precio.service';
import { ListaPrecio } from '../../lista-precio/lista-precio';

@Component({
  selector: 'app-producto-precio',
  standalone: false,
  templateUrl: 'producto-precio-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class ProductoPrecioListComponent implements OnInit {
  displayedColumns = [
    'prrProId',
    'prrLprId',
    'prrPrecio',
    'prrFechaAlta',
    'prrReiId',
    'actions',
  ];
  filter = new ProductoPrecioFilter();
  listaPrecios: ListaPrecio[]= [];
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private productoPrecioService: ProductoPrecioService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private listaPrecioService: ListaPrecioService
  ) {
    this.subs = this.productoPrecioService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.prrProId = '0';
    this.filter.prrLprId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  OnListaPreciosChange(event: any){
   this.filter.prrLprId = event.value; 
   this.search(); 
  }
  loadCatalogs() {
    this.listaPrecioService
      .find({
        lprId: '0',
        lprActivo: 'all',
        lprFechaAlta: 'all',
        lprFechaVigencia: 'all',
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.listaPrecios = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /* Accesors */

  get productoPrecioList(): ProductoPrecio[] {
    return this.productoPrecioService.productoPrecioList;
  }

  /* Métodos */

  add() {
    let newProductoPrecio: ProductoPrecio = new ProductoPrecio();

    this.edit(newProductoPrecio);
  }

  delete(productoPrecio: ProductoPrecio): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el precio de producto?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoPrecioService.delete(productoPrecio).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El precio de producto ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.productoPrecioService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: ProductoPrecio) {
    this.dialog.open(ProductoPrecioEditComponent, {
      data: { productoPrecio: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.productoPrecioService.load(this.filter);
  }
}
