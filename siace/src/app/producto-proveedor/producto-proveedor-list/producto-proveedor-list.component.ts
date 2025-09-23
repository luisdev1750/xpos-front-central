import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  listUnidades: any[] = [];
  // Nuevos controles para autocomplete
  proveedorControl = new FormControl('');
  filteredProveedores!: Observable<any[]>;

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
    this.filteredProveedores = this.proveedorControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filterValue = this._getFilterValue(value);
        return this._filterProveedores(filterValue);
      })
    );
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && value.pveNombre) {
      return value.pveNombre;
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

  displayProveedorFn(proveedor: any): string {
    return proveedor && proveedor.pveNombre ? proveedor.pveNombre : '';
  }

  onProveedorSelected(proveedor: any) {
    if (proveedor) {
      this.filter.prvPveId = proveedor.pveId;
    }
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  OnProvedorChange(event: any) {
    this.filter.prvProId = event.value;
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

   

    this.productoService.findByCatalogo('listar-unidades').subscribe(
      (res) => {
        console.log('Respuesta de busqueda');
        this.listUnidades = res;
      },
      (error) => {
        console.log(error);
      }
    );

    /// const url = `${this.api}/${filter.proId}/${filter.proFamId}/${filter.proPreId}/${filter.proActivo}`;

    this.productoService.find({
      proId: '0',
      proFamId: '0',
      proPreId: '0',
      proActivo: 'all'
    }).subscribe((res)=>{
      console.log("resultado de busqueda");
      console.log(res);
      
      
    }, (error)=>{
      console.log(error);
      
    })
  }

  onUnidadMedidaChange(event: any) {
    this.filter.prvUnmId = event.value;
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
