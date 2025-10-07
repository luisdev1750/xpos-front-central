import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BannerService } from '../banner.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { Banner } from '../banner';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-banner-edit',
   standalone: false,
   templateUrl: './banner-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class BannerEditComponent implements OnInit {

   id!: string;
   banner!: Banner;
   listSucursales: any[] = [];

   selectedFile: File | null = null;
   imagePreview: string | null = null;
   isEditing: boolean = false;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<BannerEditComponent>,
      private bannerService: BannerService,
      private toastr: ToastrService,
      private sucursalSerivice: SucursalService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.banner = { ...data.banner };
      
  
   }

   ngOnInit() {
      this.loadCatalogs();
   }

   /*Métodos*/
   
   save() {
      // El valor ya es booleano, no necesita conversión adicional
      this.bannerService.save(this.banner).subscribe({
         next: result => {
            if (result?.subId !== undefined && result?.subId !== null && Number(result.subId) >= 0) {
               this.toastr.success('El banner ha sido guardado exitosamente', 'Transacción exitosa');
               this.bannerService.setIsUpdated(true);
               this.dialogRef.close();
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {   
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }

   loadCatalogs() {
    // Cargar sucursales
    this.sucursalSerivice
      .find({
        sucId: '0',
        sucCiuId: '0',
        sucColId: '0',
        sucEmpId: '0',
        sucEstId: '0',
        sucMunId: '0'
      })
      .subscribe(
        (res) => {
          console.log('Sucursales cargadas:', res);
          this.listSucursales = res;
        },
        (error) => {
          console.log('Error al cargar sucursales:', error);
          this.toastr.error('Error al cargar sucursales', 'Error');
        }
      );
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

         this.banner.subNombre = file.name;
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
         if (this.banner.subNombre) {
            this.loadImagePreview(this.banner.subNombre);
         }
      }
   }

   // Cargar imagen existente usando getImagen
   loadImagePreview(fileName: string) {
      this.bannerService.getImagen(fileName).subscribe({
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

}