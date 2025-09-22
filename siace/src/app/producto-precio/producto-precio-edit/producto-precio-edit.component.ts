import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoPrecioService } from '../producto-precio.service';
import { ProductoPrecio } from '../producto-precio';
import { map, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { ListaPrecioService } from '../../lista-precio/lista-precio.service';
import { ListaPrecio } from '../../lista-precio/lista-precio';
import { ProductoService } from '../../producto/producto.service';



@Component({
  selector: 'app-producto-precio-edit',
  standalone: false,
  templateUrl: './producto-precio-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProductoPrecioEditComponent implements OnInit {
  id!: string;
  productoPrecio!: ProductoPrecio;
  listaPrecios: ListaPrecio[] = [];
  nameProducto: string = '';
  nameListaPrecio: string = '';
  isNew: boolean = false;
  listImpuestos: any[] = [];
  private keydownSubscription?: Subscription;
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ProductoPrecioEditComponent>,
    private productoPrecioService: ProductoPrecioService,
    private toastr: ToastrService,
    private listaPrecioService: ListaPrecioService,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productoPrecio = data.productoPrecio || {};
    console.log(data.productoPrecio);

    if (data.productoPrecio) {
      this.productoPrecio.prrProId = data.productoPrecio.prrProId;
      this.nameProducto = data.productoPrecio.prrProName;
      this.nameListaPrecio = data.productoPrecio.prrLprName;
    }
    if(data.productoPrecioItem){
      this.nameProducto = data.productoPrecioItem.prrProName;
       this.nameProducto = data.productoPrecioItem.prrProId;     
    }
    this.isNew = data.isNew ?? false;
  }

  ngOnInit() {
    this.loadCatalogs();
    
  }

  
  loadCatalogs() {
    this.productoPrecioService
      .findListPreciosExclude(this.productoPrecio.prrProId)
      .subscribe(
        (res) => {
          console.log('lista precios');

          console.log(res);
          this.listaPrecios = res;
        },
        (error) => {
          console.log(error);
        }
    );
    this.productoService
      .findProductos(this.productoPrecio.prrProId.toString())
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );

    this.productoPrecioService.findReglaImpuestos().subscribe(
      (res) => {
        console.log('Respuesta');
        console.log(res);
        this.listImpuestos = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  OnListaPreciosChange(event: any) {
    this.productoPrecio.prrLprId = event.value;
  }

  OnListImpuestosChange(event: any) {
    this.productoPrecio.prrReiId = event.value;
  }
  /*Métodos*/

  save() {
    this.productoPrecioService.save(this.productoPrecio, this.isNew).subscribe({
      next: (result) => {
        if (
          result.prrLprId !== undefined &&
          result.prrLprId !== null &&
          Number(result?.prrLprId) >= 0
        ) {
          this.toastr.success(
            'El precio de producto ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.productoPrecioService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
