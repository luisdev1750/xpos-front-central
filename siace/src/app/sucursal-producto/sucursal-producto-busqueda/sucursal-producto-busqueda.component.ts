import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductoService } from '../../producto/producto.service';
import { Producto } from '../../producto/producto';
import { SucursalProductoEditComponent } from '../sucursal-producto-edit/sucursal-producto-edit.component';
import { SucursalProducto } from '../sucursal-producto';

@Component({
  selector: 'sucursal-producto-busqueda',
  standalone: false,
  templateUrl: './sucursal-producto-busqueda.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class SucursalProductoBusquedaComponent implements OnInit {
  id!: string;

  searchText: string = '';
  listProductosImagenes: any = [];
  displayedColumns = ['priNombre', 'actions'];
  listSucursales: any = [];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<SucursalProductoBusquedaComponent>,

    private productoService: ProductoService,
    private toastr: ToastrService,
    public dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.productoImagen = data.productoImagen;
    this.listSucursales = data.listSucursales;
  }

  ngOnInit() {}

  /*Métodos*/

  searchProducts(word: string) {
    this.productoService.findByWordGeneral(word).subscribe({
      next: (result) => {
        this.listProductosImagenes = result;
        console.log(result);
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  clearSearch() {
    this.searchText = '';
  }

  edit(item: any) {
    console.log(item);

    const newSucursalProducto: SucursalProducto = {
      supSucId: 0,
      supProId: item.priId,
      supLprId: 0,
      supSucursalNombre: '',
      supProductoNombre: item.priNombre,
      supListaPrecioNombre: '',
    };

    this.dialog.open(SucursalProductoEditComponent, {
      data: {
        sucursalProducto: JSON.parse(JSON.stringify(newSucursalProducto)),
        listSucursales: this.listSucursales,
        isAdding : true
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
    this.dialogRef.close();
  }

  delete(item: any) {}
  save() {
    // this.productoImagenService.save(this.productoImagen).subscribe({
    //   next: (result) => {
    //     if (Number(result) > 0) {
    //       this.toastr.success(
    //         'El producto imagenes ha sido guardado exitosamente',
    //         'Transacción exitosa'
    //       );
    //       this.productoImagenService.setIsUpdated(true);
    //       this.dialogRef.close();
    //     } else this.toastr.error('Ha ocurrido un error', 'Error');
    //   },
    //   error: (err) => {
    //     this.toastr.error('Ha ocurrido un error', 'Error');
    //   },
    // });
  }
}
