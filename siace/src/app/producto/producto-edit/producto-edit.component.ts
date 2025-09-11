import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProductoService } from '../producto.service';
import { Producto } from '../producto';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-producto-edit',
  standalone: false,
  templateUrl: './producto-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProductoEditComponent implements OnInit {
  id!: string;
  producto!: Producto;
  familiaList: any[] = [];
  presentacionList: any[] = [];
  unidadMedidaList: any[] = [];

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ProductoEditComponent>,
    private productoService: ProductoService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.producto = data.producto;
    this.familiaList = data.familiaList;
    this.presentacionList = data.presentacionList;
    this.unidadMedidaList = data.unidadMedidaList;
  }

  ngOnInit() {}
  onFamiliaChange(event: any) {
    this.producto.proFamId = event.value;
  }

  onPresentacionChange(event: any) {
    this.producto.proPreId = event.value;
  }

  onUnidadMedidaChange(event: any) {
    this.producto.proUnmId = event.value;
  }

  onActivoChange(event: any) {
    this.producto.proActivo = event.value;
  }
  onDevolucionChange(event: any) {
    this.producto.proDevolucion = event.value;
  }

  /*Métodos*/

  save() {
    this.productoService.save(this.producto).subscribe({
      next: (result) => {
        if (result?.proId !== undefined && result?.proId !== null && Number(result.proId) >= 0) {
          this.toastr.success(
            'El producto ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.productoService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
