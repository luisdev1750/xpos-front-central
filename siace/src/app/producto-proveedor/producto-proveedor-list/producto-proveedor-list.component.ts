import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductoProveedorFilter } from '../producto-proveedor-filter';
import { ProductoProveedorService } from '../producto-proveedor.service';
import { ProductoProveedor } from '../producto-proveedor';
import { ProductoProveedorEditComponent } from '../producto-proveedor-edit/producto-proveedor-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { ProductoService } from '../../producto/producto.service';

@Component({
  selector: 'app-producto-proveedor',
  standalone: false,
  templateUrl: 'producto-proveedor-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class ProductoProveedorListComponent implements OnInit {
  displayedColumns = [
    'prvProId',
    'prvPveId',
    'prvUnmId',
    'prvPrecio',
    'actions',
  ];
  filter = new ProductoProveedorFilter();

  private subs!: Subscription;
  listProvedores: any[] = [];
  listProductos: any[] = [];
  unidadMedidaList: any[] = [];
  // Controles para autocomplete
  proveedorControl = new FormControl('');
  productoControl = new FormControl('');
  filteredProveedores!: Observable<any[]>;
  filteredProductos!: Observable<any[]>;

  /* Inicialización */

  constructor(
    private productoProveedorService: ProductoProveedorService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private proveedorService: ProveedorService,
    private productoService: ProductoService
  ) {
    this.subs = this.productoProveedorService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.prvProId = '0';
    this.filter.prvPveId = '0';
    this.filter.prvUnmId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
    this.setupAutocomplete();
  }

  setupAutocomplete() {
    // Autocomplete para proveedores
    this.filteredProveedores = this.proveedorControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filterValue = this._getFilterValue(value);
        return this._filterProveedores(filterValue);
      })
    );

    // Autocomplete para productos
    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filterValue = this._getFilterValue(value);
        return this._filterProductos(filterValue);
      })
    );
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
            if (value.pveNombre) {
        return value.pveNombre;
      }

      if (value.proNombre) {
        return value.proNombre;
      }
    }
    return '';
  }

  private _filterProveedores(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listProvedores.filter(
      (proveedor) =>
        proveedor.pveNombre.toLowerCase().includes(filterValue) ||
        proveedor.pveId.toString().includes(filterValue)
    );
  }

  private _filterProductos(value: string): any[] {
    const filterValue = value.toLowerCase();

    const filtered = this.listProductos.filter((producto) => {
     

      return (
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
      );
    });

    console.log('Productos filtrados:', filtered); // DEBUG
    return filtered;
  }

  displayProveedorFn(proveedor: any): string {
    return proveedor && proveedor.pveNombre ? proveedor.pveNombre : '';
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProveedorSelected(proveedor: any) {
    if (proveedor) {
      this.filter.prvPveId = proveedor.pveId;
     
      this.search();
    }
  }

  onProductoSelected(producto: any) {
    if (producto) {
      this.filter.prvProId = producto.proId;
      
      this.search();
    }
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  OnProvedorChange(event: any) {
    this.filter.prvProId = event.value;
  }
  onUnidadMedidaChange(event: any) {
   this.filter.prvUnmId = event.value; 
   this.search(); 
  }
  loadCatalogs() {
    this.proveedorService
      .find({
        pveId: '0',
        pveActivo: 'all',
        pveEstId: '0',
        pveMunId: '0',
        pveCiuId: '0',
        pveColId: '0',
      })
      .subscribe((res) => {
        console.log('Respuesta');
        console.log(res);
        this.listProvedores = res;
      });

    this.productoService
      .find({
        proId: '0',
        proFamId: '0',
        proPreId: '0',
        proActivo: 'all',
      })
      .subscribe(
        (res) => {
          this.listProductos = res;
        },
        (error) => {
          console.log(error);
        }
      );

    this.productoService.findByCatalogo('listar-unidades').subscribe(
      (result) => {
        console.log(result);
        this.unidadMedidaList = result;
      },
      (error) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  /* Accesors */

  get productoProveedorList(): ProductoProveedor[] {
    return this.productoProveedorService.productoProveedorList;
  }

  /* Métodos */

  add() {
    let newProductoProveedor: ProductoProveedor = new ProductoProveedor();
    this.edit(newProductoProveedor);
  }

  delete(productoProveedor: ProductoProveedor): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el producto por proveedor?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoProveedorService.delete(productoProveedor).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El producto por proveedor ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.productoProveedorService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: ProductoProveedor) {
    this.dialog.open(ProductoProveedorEditComponent, {
      data: { productoProveedor: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.productoProveedorService.load(this.filter);
  }
}
