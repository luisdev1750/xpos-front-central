import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductoService } from '../../producto/producto.service';
import { Producto } from '../../producto/producto';
import { ProductoImagenEditComponent } from '../producto-imagen-edit/producto-imagen-edit.component';

@Component({
  selector: 'app-producto-imagen-busqueda',
  standalone: false,
  templateUrl: './producto-imagen-busqueda.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProductoImagenBusquedaComponent implements OnInit {
  id!: string;
  productoImagen!: ProductoImagen;
  searchText: string = '';
  listProductosImagenes: any = [];
  displayedColumns = ['priNombre', 'actions'];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ProductoImagenBusquedaComponent>,
    private productoImagenService: ProductoImagenService,
    private productoService: ProductoService,
    private toastr: ToastrService,
       public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productoImagen = data.productoImagen;
  }

  ngOnInit() {

  }

  /*Métodos*/

  searchProducts(word: string) {
    this.productoService.findByWord(word).subscribe({
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
    const productoImagen: ProductoImagen = {
      priId: 0,
      priNombre: "",
      priProId: item.priId,
      priTimId: 0,
      priProName: item.priNombre,
      priTimName: "",
    };

       this.dialog.open(ProductoImagenEditComponent, {
          data: { productoImagen: JSON.parse(JSON.stringify(productoImagen)) },
          height: '500px',
          width: '700px',
          maxWidth: 'none',
          disableClose: true,
        });
        this.dialogRef.close();

  }

  delete(item: any) {}
  save() {
    this.productoImagenService.save(this.productoImagen).subscribe({
      next: (result) => {
        if (Number(result) > 0) {
          this.toastr.success(
            'El producto imagenes ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.productoImagenService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
