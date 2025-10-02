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
  // Propiedades existentes
  id!: string;
  combo!: Combo;
  displayedColumns = [
    'nombreProducto',
    'productoSku',
    'productoActivo',
    'actions',
  ];
  listPrecios: any[] = [];
  listSucursal: any[] = []; 
  // Nuevas propiedades para el buscador de productos
  listProductosCompleta: any[] = [];
  listProductos: any[] = [];
  productoControl = new FormControl('');
  filteredProductos!: Observable<any[]>;
  productoSeleccionado: any = null;
  private isUpdatingProgrammatically = false;

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
  }

  ngOnInit() {
    this.loadCatalogs();
    this.loadProductos();
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

      this.sucursalesService.findAll().subscribe((res)=>{
        console.log("sucursales");
        console.log(res);
        
        
        this.listSucursal = res;
      }, 
    (error)=>{
      console.log(error);
      
    })
  }
  onSucursalChange(event: any){
    this.combo.sucursalId = event.value; 
  }
  // Método para cargar productos (ajusta según tu servicio)
  loadProductos() {
    // Aquí debes llamar a tu servicio de productos
    // Por ejemplo: this.productoService.find({...}).subscribe(...)
    // Por ahora lo dejo como ejemplo
 ////
     this.productoService.find({ 
      proId: '0',
      proFamId: '0',
      proPreId: '0',
      proActivo: 'true'
     }).subscribe({
    next: (productos) => {
      this.listProductosCompleta = productos;
      this.listProductos = [...productos];
      this.setupAutocomplete();
    },
    error: (error) => {
      console.error('Error cargando productos:', error);
      this.toastr.error('Error cargando productos', 'Error');
    }
  });

    // Temporal - simula datos para que veas la estructura
 
    this.setupAutocomplete();
  }

  // Configuración del autocomplete
  setupAutocomplete() {
    if (this.listProductosCompleta.length === 0) return;

    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProductos(this._getFilterValue(value)))
    );
  }

  // Obtener valor del filtro
  private _getFilterValue(value: any): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.proNombre)
      return value.proNombre;
    return '';
  }

  // Filtrar productos
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

  // Mostrar nombre del producto en el input
  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  // Cuando se selecciona un producto
  onProductoSelected(producto: any) {
    if (this.isUpdatingProgrammatically) return;
    if (!producto || !producto.proId) return;

    this.productoSeleccionado = producto;
    console.log('Producto seleccionado:', producto);
  }

  // Agregar producto a la tabla
  agregarProducto() {
    if (!this.productoSeleccionado) {
      this.toastr.warning('Debe seleccionar un producto', 'Advertencia');
      return;
    }

    // Verificar si el producto ya existe en la lista
    const existe = this.combo.productos.some(
      (p: any) => p.productoId === this.productoSeleccionado.proId
    );

    if (existe) {
      this.toastr.warning('El producto ya está en el combo', 'Advertencia');
      return;
    }

    // Agregar el producto a la lista
    const nuevoProducto = {
      productoId: this.productoSeleccionado.proId,
      productoNombre: this.productoSeleccionado.proNombre,
      productoSku: this.productoSeleccionado.proSku,
      productoActivo: this.productoSeleccionado.proActivo,
    };

    this.combo.productos = [...this.combo.productos, nuevoProducto];

    // Limpiar selección
    this.productoControl.reset();
    this.productoSeleccionado = null;

    this.toastr.success('Producto agregado al combo', 'Éxito');
  }

  // Limpiar búsqueda
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
      (p: any) => p.productoId !== item.productoId
    );
    this.toastr.success('Producto eliminado del combo', 'Éxito');
  }

  save() {
    this.comboService.save(this.combo).subscribe({
      next: (result) => {
        if (
          result?.comboId > 0
        ) {
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