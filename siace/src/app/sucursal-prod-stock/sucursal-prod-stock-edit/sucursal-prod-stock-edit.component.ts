import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SucursalProdStockService } from '../sucursal-prod-stock.service';
import { SucursalProdStock } from '../sucursal-prod-stock';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductoService } from '../../producto/producto.service';

@Component({
  selector: 'app-sucursal-prod-stock-edit',
  standalone: false,
  templateUrl: './sucursal-prod-stock-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class SucursalProdStockEditComponent implements OnInit {
  id!: string;
  sucursalProdStock!: SucursalProdStock;
  isReadonly: boolean = false;
  listSucursal: any[] = [];
  listProducto: any[] = [];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<SucursalProdStockEditComponent>,
    private sucursalProdStockService: SucursalProdStockService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sucursalProdStock = data.sucursalProdStock;
    this.listSucursal = data.listSucursal;
    this.listProducto = data.listProducto;
    this.isReadonly = data.isReadOnly || false;

    console.log(this.listProducto);
  }

  ngOnInit() {
    // if (this.sucursalProdStock.spsSucId){
    //    this.sucursalProdStockService
    //    .findCatalog(this.sucursalProdStock.spsSucId)
    //    .subscribe(
    //      (result) => {
    //        console.log(result);
    //        this.listProducto = result;
    //      },
    //      (error) => {
    //        this.toastr.error('Ha ocurrido un error', 'Error');
    //      }
    //    );
    // }
  }
  onChangeSucursalId(event: any) {
    this.sucursalProdStock.spsSucId = event.value;

    if (this.isReadonly) {
      this.sucursalProdStockService
        .findCatalog(this.sucursalProdStock.spsSucId)
        .subscribe(
          (result) => {
            console.log(result);
            this.listProducto = result;
          },
          (error) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
    } else {
         this.sucursalProdStockService
        .findCatalogExcluir(this.sucursalProdStock.spsSucId)
        .subscribe(
          (result) => {
            console.log(result);
            this.listProducto = result;
          },
          (error) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
    }
  }

  OnChangeProducto(event: any) {
    this.sucursalProdStock.spsProId = event.value;
    //this.sucursalProdStock.spsProId = event.value;
  }
  // onChangeActivo(event: any) {
  //    this.sucursalProdStock.spsActivo = event.value;
  // }

  /*Métodos*/

  save() {
    this.sucursalProdStockService.save(this.sucursalProdStock).subscribe({
      next: (result) => {
        if (
          result?.spsProId !== undefined &&
          result?.spsProId !== null &&
          Number(result.spsProId) >= 0
        ) {
          this.toastr.success(
            'El sucursal productos stock ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.sucursalProdStockService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
