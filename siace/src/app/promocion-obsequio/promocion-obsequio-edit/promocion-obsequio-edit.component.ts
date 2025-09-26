import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PromocionObsequioService } from '../promocion-obsequio.service';
import { PromocionObsequio } from '../promocion-obsequio';
import { ProductoService } from '../../producto/producto.service';

@Component({
  selector: 'app-promocion-obsequio-edit',
  standalone: false,
  templateUrl: './promocion-obsequio-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class PromocionObsequioEditComponent implements OnInit {
  id!: string;
  promocionObsequio!: PromocionObsequio;

  // Lista de productos para autocomplete
  listProductos: any[] = [];

  // Control para autocomplete de productos
  productoControl = new FormControl('');
  //   promocionObsequio: PromocionObsequio = new PromocionObsequio();
  // Observable filtrado para productos
  filteredProductos!: Observable<any[]>;
  promocionId: string = '';
  sucursalId: string = '';
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<PromocionObsequioEditComponent>,
    private promocionObsequioService: PromocionObsequioService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocionObsequio = data.promocionObsequio;
    this.sucursalId = data.sucursalId;
    this.promocionId = data.promocionId;
  }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    // Cargar productos
    this.productoService
      .findProductsForPromocionesObsequios(Number(this.promocionId), Number(this.sucursalId))
      .subscribe((res) => {
        this.listProductos = res;
        console.log("Lista de productos final");

        console.log(this.listProductos);
        
        this.setupAutocomplete();
        this.setInitialValues();
      });
  }

  setupAutocomplete() {
    if (this.listProductos.length > 0) {
      // Autocomplete para productos
      this.filteredProductos = this.productoControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const filterValue = this._getFilterValue(value);
          return this._filterProductos(filterValue);
        })
      );
    }
  }

  setInitialValues() {
    // Establecer valor inicial basado en el ID existente
    if (this.promocionObsequio.pobProId && this.listProductos.length > 0) {
      const producto = this.listProductos.find(
        (p) => p.proId == this.promocionObsequio.pobProId
      );
      if (producto) {
        this.productoControl.setValue(producto);
      }
    }
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && value.proNombre) {
      return value.proNombre;
    }
    return '';
  }

  private _filterProductos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listProductos.filter((producto) => {
      return (
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
      );
    });
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoSelected(producto: any) {
    console.log('Producto seleccionado');
    console.log(producto);
    console.log(this.promocionId);
    console.log(this.sucursalId);

    this.promocionObsequio = {
      pobId: 0,
      pobPmoId: Number(this.promocionId),
      pobFamId: producto.proFamId,
      pobPreId: producto.proPreId,
      pobProId: producto.proId,
      pobPmoSucId: Number(this.sucursalId),
    };

    if (producto) {
      this.promocionObsequio.pobProId = producto.proId;
    }
  }

  /*Métodos*/

  save() {
    this.promocionObsequioService.save(this.promocionObsequio).subscribe({
      next: (result) => {
        if (result.pobPmoId != null && result.pobPmoId != undefined && result.pobPmoId > 0) {
          this.toastr.success(
            'El promoción obsequio ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionObsequioService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
