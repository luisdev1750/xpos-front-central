import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ComboService } from '../combo.service';
import { Combo } from '../combo';
import { ListaPrecioService } from '../../lista-precio/lista-precio.service';
import { ProductoService } from '../../producto/producto.service';
import { SucursalService } from '../../sucursal/sucursal.service';

@Component({
  selector: 'app-banco-edit',
  standalone: false,
  templateUrl: './combo-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ComboEditComponent implements OnInit {
  id!: string;
  combo!: Combo;
  isEditMode: boolean = false;
  displayedColumns = [
    'nombreProducto',
    'productoSku',
    'productoActivo',
    'actions',
  ];
  listPrecios: any[] = [];
  listSucursal: any[] = [];
  listProductosCompleta: any[] = [];
  listProductos: any[] = [];
  productoControl = new FormControl('');
  filteredProductos!: Observable<any[]>;
  productoSeleccionado: any = null;
  private isUpdatingProgrammatically = false;
  private nextTempId: number = -1; // 🔹 Contador para IDs temporales únicos

  constructor(
    private dialogRef: MatDialogRef<ComboEditComponent>,
    private comboService: ComboService,
    private toastr: ToastrService,
    private listaPrecioService: ListaPrecioService,
    private productoService: ProductoService,
    private sucursalesService: SucursalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data recuperada');
    console.log(data);
    this.combo = { ...data.combo };

    this.isEditMode =
      this.combo.comboId && this.combo.comboId > 0 ? true : false;
    
    // 🔹 Asignar IDs temporales únicos a productos existentes que no los tengan
    if (this.combo.productos && this.combo.productos.length > 0) {
      this.combo.productos = this.combo.productos.map((p: any) => {
        if (!p._tempId) {
          return { ...p, _tempId: this.nextTempId-- };
        }
        return p;
      });
    }
  }

  ngOnInit() {
    this.loadCatalogs();

    if (this.combo.sucursalId) {
      this.loadProductos(this.combo.sucursalId);
    }
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
          console.log('Resultado de lista precios');
          console.log(res);
          this.listPrecios = res;
        },
        (err) => {
          console.log('error al traer lista de precios');
          console.log(err);
        }
      );

    this.sucursalesService.findAll().subscribe(
      (res) => {
        console.log('sucursales');
        console.log(res);

        this.listSucursal = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSucursalChange(event: any) {
    if (!this.canChangeSucursal()) {
      this.toastr.warning(
        'No puede cambiar la sucursal. Primero elimine todos los productos del combo.',
        'Advertencia'
      );
      event.source.value = this.combo.sucursalId;
      return;
    }

    this.combo.sucursalId = event.value;

    if (event.value) {
      this.loadProductos(event.value);
    } else {
      this.listProductosCompleta = [];
      this.listProductos = [];
      this.productoControl.reset();
      this.productoSeleccionado = null;
    }
  }

  canChangeSucursal(): boolean {
    if (this.isEditMode) {
      return false;
    }

    return !this.combo.productos || this.combo.productos.length === 0;
  }

  loadProductos(sucursalId: number) {
    if (!sucursalId || sucursalId <= 0) {
      this.toastr.warning(
        'Debe seleccionar una sucursal primero',
        'Advertencia'
      );
      this.listProductosCompleta = [];
      this.listProductos = [];
      return;
    }

    this.comboService.findProductos(sucursalId).subscribe({
      next: (productos) => {
        console.log('Productos de sucursal ' + sucursalId);
        console.log(productos);

        if (productos && productos.length > 0) {
          this.listProductosCompleta = productos;
          this.listProductos = [...productos];
          this.setupAutocomplete();
          this.toastr.success(
            `${productos.length} productos cargados`,
            'Éxito'
          );
        } else {
          this.listProductosCompleta = [];
          this.listProductos = [];
          this.toastr.info(
            'No hay productos disponibles para esta sucursal',
            'Información'
          );
        }
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.toastr.error('Error cargando productos', 'Error');
        this.listProductosCompleta = [];
        this.listProductos = [];
      },
    });
  }

  setupAutocomplete() {
    if (this.listProductosCompleta.length === 0) return;

    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProductos(this._getFilterValue(value)))
    );
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.proNombre)
      return value.proNombre;
    return '';
  }

  private _filterProductos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listProductos.filter(
      (producto) =>
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        (producto.proSku &&
          producto.proSku.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
    );
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoSelected(producto: any) {
    if (this.isUpdatingProgrammatically) return;
    if (!producto || !producto.proId) return;

    this.productoSeleccionado = producto;
    console.log('Producto seleccionado:', producto);
  }

  agregarProducto() {
    if (!this.productoSeleccionado) {
      this.toastr.warning('Debe seleccionar un producto', 'Advertencia');
      return;
    }

    // 🔹 Crear nuevo producto con ID temporal único
    const nuevoProducto = {
      productoId: this.productoSeleccionado.proId,
      productoNombre: this.productoSeleccionado.proNombre,
      productoSku: this.productoSeleccionado.proSku,
      productoActivo: this.productoSeleccionado.proActivo,
      _tempId: this.nextTempId-- // ID temporal único para identificar esta fila específica
    };

    this.combo.productos = [...this.combo.productos, nuevoProducto];

    // Limpiar selección
    this.productoControl.reset();
    this.productoSeleccionado = null;

    this.toastr.success('Producto agregado al combo', 'Éxito');
  }

  onProductoClear() {
    this.productoControl.reset();
    this.productoSeleccionado = null;
  }

  onListaPrecioChange(event: any) {
    this.combo.listaPrecioId = event.value;
  }

  edit(item: any) {
    console.log('editando');
  }

  delete(item: any) {
    console.log('Borrando producto:', item);

    this.combo.productos = this.combo.productos.filter(
      (p: any) => p._tempId !== item._tempId
    );
    this.toastr.success('Producto eliminado del combo', 'Éxito');
  }

  save() {
    // 🔹 Limpiar _tempId antes de enviar al backend
    const comboToSave = {
      ...this.combo,
      productos: this.combo.productos.map((p: any) => {
        const { _tempId, ...productoSinTempId } = p;
        return productoSinTempId;
      })
    };

    this.comboService.save(comboToSave).subscribe({
      next: (result) => {
        if (result?.comboId > 0) {
          this.toastr.success(
            'El combo ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.comboService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}