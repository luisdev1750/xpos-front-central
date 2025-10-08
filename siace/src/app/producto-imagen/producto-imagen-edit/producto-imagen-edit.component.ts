import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';

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

   constructor(
      private dialogRef: MatDialogRef<ProductoImagenEditComponent>,
      private productoImagenService: ProductoImagenService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any
   ) {
      this.productoImagen = data.productoImagen;
      this.isEditing = this.productoImagen.priId > 0;
      
      // Si estamos editando y existe una imagen, cargar la vista previa
      if (this.isEditing && this.productoImagen.priNombre && this.productoImagen.priProId) {
         this.loadImagePreview(this.productoImagen.priProId, this.productoImagen.priNombre);
      }
   }

   ngOnInit() {
      this.loadCatalogs();
   }

   // Cargar imagen existente usando getImagen - ACTUALIZADO con priProId
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

         // Validar tamaño (ejemplo: máximo 5MB)
         const maxSize = 5 * 1024 * 1024; // 5MB
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