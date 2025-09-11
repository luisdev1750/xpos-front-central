import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UploadFileService } from './upload-file.service';

@Component({
  selector: 'app-encuestas-list',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent {
  selectedFile: File | null = null;

  constructor(
    private uploadFileService: UploadFileService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UploadFileComponent>, // Especifica el tipo de componente
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      console.log('Archivo seleccionado:', this.selectedFile);
      this.uploadFileService.uploadFile(this.selectedFile).subscribe({
        next: (result) => {
          console.log('Resultado');
          console.log(result);
          this.toastr.success(
            'El archivo fue cargado de forma exitosa.',
            'Éxito'
          );
          // Cierra el modal después de subir el archivo exitosamente
          this.dialogRef.close(result); 
        },
        error: (error) => {
          this.toastr.error('Ha ocurrido un error en la carga del archivo: '+ error.error);
          console.log('Error');
          console.log(error);
        },
      });
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }
}