import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';
import { ProductoService } from '../../producto/producto.service';

@Component({
   selector: 'app-producto-imagen-edit',
   standalone: false,
   templateUrl: './producto-imagen-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}',
      '.image-preview { max-width: 200px; max-height: 200px; margin: 10px 0; border-radius: 8px; }',
      '.file-input-wrapper { margin: 15px 0; }'
   ]
})
export class ProductoImagenEditComponent implements OnInit {
   productoImagen!: ProductoImagen;
   listTipoImagenes: any = [];
   selectedFile: File | null = null;
   imagePreview: string | null = null;
   isEditing: boolean = false;

   // Propiedades para el buscador de productos
   listProductosCompleta: any[] = [];
   listProductos: any[] = [];
   productoControl = new FormControl('');
   filteredProductos!: Observable<any[]>;
   productoSeleccionado: any = null;

   constructor(
      private dialogRef: MatDialogRef<ProductoImagenEditComponent>,
      private productoImagenService: ProductoImagenService,
      private productoService: ProductoService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any
   ) {
      this.productoImagen = data.productoImagen;
      this.isEditing = this.productoImagen.priId > 0;
      console.log("data producto");
console.log(data);

      // Si estamos editando y existe una imagen, cargar la vista previa
      if (this.isEditing && this.productoImagen.priNombre && this.productoImagen.priProId) {
         this.loadImagePreview(this.productoImagen.priProId, this.productoImagen.priNombre);
      }
   }

   ngOnInit() {
      this.loadCatalogs();
      this.loadProductos();
   }

   // Una vez que se cargan los productos, setear el seleccionado
   onProductosLoaded() {
      if (this.productoImagen.priProId && this.listProductosCompleta.length > 0) {
         const productoSeleccionadoDelCatalogo = this.listProductosCompleta.find(
            (p) => p.proId === this.productoImagen.priProId
         );
         if (productoSeleccionadoDelCatalogo) {
            this.productoSeleccionado = productoSeleccionadoDelCatalogo;
            this.productoControl.setValue(productoSeleccionadoDelCatalogo);
         }
      }
   }

   loadCatalogs() {
      this.productoImagenService.findTipoImagenes().subscribe({
         next: result => {
            this.listTipoImagenes = result;
         },
         error: err => {
            this.toastr.error('Error al cargar tipos de imágenes', 'Error');
         }
      });
   }

   // Cargar productos para el buscador
   loadProductos() {
      this.productoImagenService.findAllProductosImagenes().subscribe({
         next: (productos) => {
            this.listProductosCompleta = productos;
            this.listProductos = [...productos];
            this.setupAutocomplete();
            // Una vez que se cargan los productos, setear el del data si existe
            this.onProductosLoaded();
         },
         error: (error) => {
            console.error('Error cargando productos:', error);
            this.toastr.error('Error cargando productos', 'Error');
         }
      });
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
      if (!producto || !producto.proId) return;

      this.productoSeleccionado = producto;
      this.productoImagen.priProId = producto.proId;
      this.productoImagen.priProName = producto.proNombre;
      
      console.log('Producto seleccionado:', producto);
      this.toastr.success('Producto seleccionado', 'Éxito');
   }

   // Limpiar búsqueda
   onProductoClear() {
      this.productoControl.reset();
      this.productoSeleccionado = null;
      this.productoImagen.priProId = 0;
      this.productoImagen.priProName = '';
   }

   // Cargar imagen existente
   loadImagePreview(priProId: number, fileName: string) {
      this.productoImagenService.getImagen(priProId, fileName).subscribe({
         next: (blob: Blob) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
               this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(blob);
         },
         error: (err) => {
            console.error('Error al cargar imagen', err);
            this.toastr.warning('No se pudo cargar la vista previa de la imagen', 'Advertencia');
         }
      });
   }

   onProductoImagenChange(event: any) {
      this.productoImagen.priTimId = event.value;
   }

   // Manejar la selección de archivo
   onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
         // Validar tipo de archivo
         const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
         if (!validTypes.includes(file.type)) {
            this.toastr.error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)', 'Error');
            return;
         }

         // Validar tamaño (máximo 5MB)
         const maxSize = 5 * 1024 * 1024;
         if (file.size > maxSize) {
            this.toastr.error('El archivo es demasiado grande. Máximo 5MB', 'Error');
            return;
         }

         this.selectedFile = file;
         
         // Generar vista previa del nuevo archivo
         const reader = new FileReader();
         reader.onload = (e: any) => {
            this.imagePreview = e.target.result;
         };
         reader.readAsDataURL(file);
      }
   }

   // Limpiar la imagen seleccionada
   clearImage() {
      this.selectedFile = null;
      if (!this.isEditing) {
         this.imagePreview = null;
      } else {
         // Restaurar la imagen original si estamos editando
         if (this.productoImagen.priNombre && this.productoImagen.priProId) {
            this.loadImagePreview(this.productoImagen.priProId, this.productoImagen.priNombre);
         }
      }
   }

   save() {
      // Validaciones
      if (!this.isEditing && !this.selectedFile) {
         this.toastr.error('Debe seleccionar una imagen', 'Error');
         return;
      }

      if (!this.productoImagen.priProId) {
         this.toastr.error('Debe seleccionar un producto', 'Error');
         return;
      }

      if (!this.productoImagen.priTimId) {
         this.toastr.error('Debe seleccionar un tipo de imagen', 'Error');
         return;
      }

      // Llamar al servicio
      this.productoImagenService.save(this.productoImagen, this.selectedFile || undefined).subscribe({
         next: result => {
            if (result && (result.priId || result.message)) {
               const mensaje = this.isEditing 
                  ? 'La imagen del producto ha sido actualizada exitosamente' 
                  : 'La imagen del producto ha sido guardada exitosamente';
               this.toastr.success(mensaje, 'Transacción exitosa');
               this.productoImagenService.setIsUpdated(true);
               window.location.reload();
               this.dialogRef.close(result);
            } else {
               this.toastr.error('Ha ocurrido un error al guardar', 'Error');
            }
         },
         error: err => {
            console.error('Error al guardar:', err);
            const errorMsg = err.error?.error || err.error?.message || 'Ha ocurrido un error';
            this.toastr.error(errorMsg, 'Error');
         }
      });
   }

   cancel() {
      this.dialogRef.close();
   }
}