import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProductoProveedorService } from '../producto-proveedor.service';
import { ProductoProveedor } from '../producto-proveedor';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { ProductoService } from '../../producto/producto.service';

@Component({
   selector: 'app-producto-proveedor-edit',
   standalone: false,
   templateUrl: './producto-proveedor-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class ProductoProveedorEditComponent implements OnInit {

   id!: string;
   productoProveedor!: ProductoProveedor;
   
   // Listas de catálogos
   listProveedores: any[] = [];
   listProductos: any[] = [];
   unidadMedidaList: any[] = [];
   
   // Controles para autocomplete
   proveedorControl = new FormControl('');
   productoControl = new FormControl('');
   
   // Observables filtrados
   filteredProveedores!: Observable<any[]>;
   filteredProductos!: Observable<any[]>;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ProductoProveedorEditComponent>,
      private productoProveedorService: ProductoProveedorService,
      private toastr: ToastrService,
      private proveedorService: ProveedorService,
      private productoService: ProductoService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productoProveedor = data.productoProveedor;
   }

   ngOnInit() {
      this.loadCatalogs();
   }

   loadCatalogs() {
      // Cargar proveedores
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
            this.listProveedores = res;
            this.setupAutocomplete();
            this.setInitialValues();
         });

      // Cargar productos
      this.productoService
         .find({
            proId: '0',
            proFamId: '0',
            proPreId: '0',
            proActivo: 'all',
         })
         .subscribe((res) => {
            this.listProductos = res;
            this.setupAutocomplete();
            this.setInitialValues();
         });

      // Cargar unidades de medida
      this.productoService.findByCatalogo('listar-unidades').subscribe(
         (result) => {
            this.unidadMedidaList = result;
         },
         (error) => {
            this.toastr.error('Ha ocurrido un error cargando unidades de medida', 'Error');
         }
      );
   }

   setupAutocomplete() {
      if (this.listProveedores.length > 0) {
         // Autocomplete para proveedores
         this.filteredProveedores = this.proveedorControl.valueChanges.pipe(
            startWith(''),
            map((value) => {
               const filterValue = this._getFilterValue(value);
               return this._filterProveedores(filterValue);
            })
         );
      }

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
      // Establecer valores iniciales basados en los IDs existentes
      if (this.productoProveedor.prvProId && this.listProductos.length > 0) {
         const producto = this.listProductos.find(p => p.proId == this.productoProveedor.prvProId);
         if (producto) {
            this.productoControl.setValue(producto);
         }
      }

      if (this.productoProveedor.prvPveId && this.listProveedores.length > 0) {
         const proveedor = this.listProveedores.find(p => p.pveId == this.productoProveedor.prvPveId);
         if (proveedor) {
            this.proveedorControl.setValue(proveedor);
         }
      }
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
      return this.listProveedores.filter(
         (proveedor) =>
            proveedor.pveNombre.toLowerCase().includes(filterValue) ||
            proveedor.pveId.toString().includes(filterValue)
      );
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

   displayProveedorFn(proveedor: any): string {
      return proveedor && proveedor.pveNombre ? proveedor.pveNombre : '';
   }

   displayProductoFn(producto: any): string {
      return producto && producto.proNombre ? producto.proNombre : '';
   }

   onProveedorSelected(proveedor: any) {
      if (proveedor) {
         this.productoProveedor.prvPveId = proveedor.pveId;
      }
   }

   onProductoSelected(producto: any) {
      if (producto) {
         this.productoProveedor.prvProId = producto.proId;
      }
   }

   onUnidadMedidaChange(event: any) {
      this.productoProveedor.prvUnmId = event.value;
   }

   /*Métodos*/
   
   save() {
      this.productoProveedorService.save(this.productoProveedor).subscribe({
         next: result => {
            if (Number(result) > 0) {
               this.toastr.success('El producto por proveedor ha sido guardado exitosamente', 'Transacción exitosa');
               this.productoProveedorService.setIsUpdated(true);
               this.dialogRef.close();
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }
}