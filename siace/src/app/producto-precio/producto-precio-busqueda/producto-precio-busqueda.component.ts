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
import { ProductoPrecioEditComponent } from '../producto-precio-edit/producto-precio-edit.component';
import { ProductoPrecio } from '../producto-precio';
// import { SucursalProductoEditComponent } from '../sucursal-producto-edit/sucursal-producto-edit.component';
// import { SucursalProducto } from '../sucursal-producto';

@Component({
  selector: 'sucursal-producto-busqueda',
  standalone: false,
  templateUrl: './producto-precio-busqueda.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProductoPrecioBusquedaComponent implements OnInit {
  id!: string;

  searchText: string = '';
  listProductosImagenes: any = [];
  displayedColumns = ['priNombre', 'actions'];
  listSucursales: any = [];
  isNew:boolean = false;
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ProductoPrecioBusquedaComponent>,

    private productoService: ProductoService,
    private toastr: ToastrService,
    public dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.productoImagen = data.productoImagen;
    this.listSucursales = data.listSucursales;
    this.isNew = data.isNew ?? false; 
  }

  ngOnInit() {}

  /*Métodos*/

  searchProducts(word: string) {
    this.productoService.findProductos(word).subscribe({
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

  
    const productoPrecioItem = {
      prrProId: item.proId,
      prrProName: item.proNombre,
    };

    this.dialog.open(ProductoPrecioEditComponent, {
      data: {
        productoPrecio: JSON.parse(JSON.stringify(productoPrecioItem)),
        isAdding: true,
        isNew : this.isNew
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

  }
}
