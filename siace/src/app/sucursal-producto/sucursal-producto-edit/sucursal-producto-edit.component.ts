import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SucursalProductoService } from '../sucursal-producto.service';
import { SucursalProducto } from '../sucursal-producto';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ListaPrecioService } from '../../lista-precio/lista-precio.service';

@Component({
  selector: 'app-sucursal-producto-edit',
  standalone: false,
  templateUrl: './sucursal-producto-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class SucursalProductoEditComponent implements OnInit {
  id!: string;
  sucursalProducto!: SucursalProducto;
  listSucursales: any = [];
  listListaPrecios: any = [];
  isAdding: boolean = false;
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<SucursalProductoEditComponent>,
    private sucursalProductoService: SucursalProductoService,
    private toastr: ToastrService,
    private listaPrecioService: ListaPrecioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sucursalProducto = data.sucursalProducto;
    this.listSucursales = data.listSucursales;
    this.isAdding = data.isAdding ? data.isAdding : false;
  }

  ngOnInit() {

      if (this.isAdding) {
    if (this.sucursalProducto.supSucId === 0) {
      this.sucursalProducto.supSucId = null;
    }
    if (this.sucursalProducto.supLprId === 0) {
      this.sucursalProducto.supLprId = null;
    }
  }
    this.loadCatalogs();
  }
  loadCatalogs() {
    if (!this.isAdding) {
      this.listaPrecioService
        .find({
          lprId: '0',
          lprActivo: 'all',
          lprFechaVigencia: 'all',
          lprFechaAlta: 'all',
        })
        .subscribe({
          next: (result) => {
            console.log(result);
            this.listListaPrecios = result;
          },
          error: (err) => {
            this.toastr.error(
              'Ha ocurrido un error al cargar los catálogos',
              'Error'
            );
          },
        });
    }
  }

  onSucursalChange(event: any) {
    this.sucursalProducto.supSucId = event.value;
    if (this.sucursalProducto.supSucId) {
      this.listaPrecioService
        .findListaFromProductosSucursal(
          this.sucursalProducto.supSucId,
          this.sucursalProducto.supProId
        )
        .subscribe(
          (res) => {
            console.log('Respuesta de productos sucursal:');
            console.log(res);
            this.listListaPrecios = res;
            if (res.length == 0) {
              this.toastr.info(
                'Este producto no tiene listas de precios para esta sucursal'
              );
            }
          },
          (error) => {
            console.log();
            this.toastr.error(
              'No se pudo encontrar lista de precios para la sucursal y producto seleccionados'
            );
          }
        );
    }
  }

  onProductoChange(event: any) {
    this.sucursalProducto.supProId = event.value;
  }

  onListaPrecioChange(event: any) {
    this.sucursalProducto.supLprId = event.value;
  }

  /*Métodos*/

  save() {
    this.sucursalProductoService.save(this.sucursalProducto).subscribe({
      next: (result) => {
        if (
          result.supProId !== undefined &&
          result.supProId != null &&
          Number(result.supProId) >= 0
        ) {
          this.toastr.success(
            'El producto por sucursal ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.sucursalProductoService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
