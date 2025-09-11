import { Component, Inject, OnInit, Input, ViewChild, ViewChildren, Output, EventEmitter, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RespuestaA3Service } from '../respuesta-a3.service';
import { RespuestaA3Filter } from '../respuesta-a3-filter';
import { RespuestaA3 } from '../respuesta-a3';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Evidencia } from '../../evidencia/evidencia';
import { GeneralService } from '../../common/general.service';
import { GeneralComponent } from '../../common/general-component';
import { LocationStrategy } from '@angular/common';

@Component({
   selector: 'app-a3-edit',
   templateUrl: './a3-edit.component.html',
   styleUrl: './a3-edit.component.css',
   providers: [RespuestaA3Service],
})
export class A3EditComponent extends GeneralComponent implements OnInit {
   @Output() evidenciasCambios = new EventEmitter<void>();
   @Output() dataActualizada: EventEmitter<void> = new EventEmitter<void>();

   fileNames: string[] = ['', '', '', ''];
   idPilar: number = 0;
   idActividad: number = 0;
   idEmprendedor: number = 0;
   myGroup!: FormGroup;
   aaaDescripcion!: string;

   private editedDescription: { [id: number]: string } = {};

   constructor(
      private respuestaA3Service: RespuestaA3Service,
      public dialogRef: MatDialogRef<A3EditComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      protected override locationStrategy: LocationStrategy
   ) {
      super(locationStrategy);

      this.idEmprendedor = data.empId;
      this.idActividad = data.aaaId;
      this.idPilar = data.pilId;
      this.aaaDescripcion = data.aaaDescripcion;

      this.myGroup = new FormGroup({
         multiplefile: new FormControl(),
      });
   }

   ngOnInit(): void {
      this.search();
   }


   /* Accesosors */
   get respuestas() {
      return this.respuestaA3Service.respuestaA3List;
   }


   /*Metodos*/
   createFormGroup() {
      const group: any = {};
      this.respuestas.forEach((evidencia, index) => {
         group[`multiplefile${index}`] = new FormControl();
      });
      this.myGroup = this.formBuilder.group(group);
   }


   onDeleteClick(evidencia: RespuestaA3): void {
      if (!evidencia.reaArchivo) {
         this.toastr.warning('No hay archivo que eliminar', 'Advertencia');
      } else {
         this.respuestaA3Service
            .delete(
               //  this.idEmprendedor,
               //  this.idPilar,
               //  this.idActividad,
               evidencia.reaId
            )
            .subscribe({
               next: (response) => {
                  this.toastr.success('Archivo eliminado exitosamente', 'Éxito');
                  this.search();
                  this.evidenciasCambios.emit();
                  this.dataActualizada.emit();
               },
               error: (error) => {
                  this.toastr.error('Error al eliminar el archivo', 'Error');
                  console.error('Error al eliminar el archivo:', error);
               },
            });
      }
   }


   onDescriptionEdited(reaId: number, event: Event): void {
      const target = event.target as HTMLInputElement;
      if (target) {
         const value = target.value;
         this.editedDescription[reaId] = value;
         console.log(`Respuesta ID: ${reaId}, Nuevo Descripción: ${value}`);
      }
   }


   onDownloadClick(formato: string): void {
      // Obtener la fecha actual y restar 6 horas
      const date = new Date();
      date.setHours(date.getHours() - 6); // Resta 6 horas

      // Formatear la fecha como yyyyMMddHHmmss
      let formattedDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 15);
      formattedDate = formattedDate.replace(/\.$/, '');

      // Construir la URL completa
      const url = `${formato}?${this.user.blobToken}`;

      // Descargar el archivo con el nombre personalizado
      fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error("Error al descargar el archivo.");
            }
            return response.blob();
         })
         .then(blob => {
            // Obtener el nombre base del archivo original
            const fileName = formato.split('/').pop() ?? 'archivo';

            // Separar el nombre y la extensión
            const dotIndex = fileName.lastIndexOf('.');
            const baseName = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
            const extension = dotIndex !== -1 ? fileName.substring(dotIndex) : '';

            // Crear un enlace temporal para descargar el archivo
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${baseName}_${formattedDate}${extension}`; // Nombre con la fecha antes de la extensión
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Liberar el objeto URL
            URL.revokeObjectURL(downloadUrl);
         })
         .catch(error => {
            console.error("Error al descargar el archivo:", error);
         });
   }


   onFileSelected(event: Event, evidencia: any, index: number): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
         evidencia.requireDescription = true;
         this.setFilename(input.files, index);
      }
   }


   onNoClick(): void {
      this.dialogRef.close();
   }


   onSaveClick(): void {
      if (this.idEmprendedor !== null) {
         let descripcionActualizada = false;
         const actualizaciones: Promise<any>[] = [];

         this.respuestas.forEach((evidencia) => {
            const evidenciaItem = document.querySelector(`#evidencia-item-${evidencia.reaEviId}`);

            if (evidenciaItem) {
               const descriptionInput = evidenciaItem.querySelector('.description-input') as HTMLInputElement;
               const newDescription = descriptionInput.value == '' ? 'NA' : descriptionInput.value;//

               if (evidencia.reaArchivo && newDescription !== undefined) {
                  if (!newDescription) {
                     this.toastr.warning('La descripción está vacía.', 'Advertencia');
                     return;
                  }

                  if (newDescription !== evidencia.reaDescripcion) {
                     // Si la descripción es diferente, actualízala
                     const updatePromise = this.respuestaA3Service
                        .update(evidencia.reaId, newDescription)
                        .toPromise()
                        .then((response) => {
                           console.log('Descripción actualizada:', response);
                           descripcionActualizada = true;
                        })
                        .catch((error) => {
                           this.toastr.error('Error al actualizar la descripción');
                           console.error('Error al actualizar la descripción:', error);
                        });

                     actualizaciones.push(updatePromise);
                  }
               } else {
                  const fileInput = evidenciaItem.querySelector('.file-input>input') as HTMLInputElement;

                  if (fileInput && fileInput.files && fileInput.files.length > 0) {
                     const file = fileInput.files[0];
                     const uploadPromise = this.respuestaA3Service
                        .upload(file, this.idEmprendedor, this.idPilar, this.idActividad, evidencia.reaEviId, newDescription)
                        .toPromise()
                        .then((response) => {
                           console.log('Archivo subido:', response);
                           this.toastr.success('Archivo(s) subido(s) exitosamente', 'Ok');
                           this.search();
                           this.evidenciasCambios.emit();
                           this.dataActualizada.emit();
                           //this.generalService.emitRefresh();
                        })
                        .catch((error) => {
                           this.toastr.error('Error al subir el archivo');
                           console.error('Error al subir el archivo:', error);
                        });

                     actualizaciones.push(uploadPromise);
                  }
               }
            }
         });

         // Esperar a que todas las actualizaciones terminen
         Promise.all(actualizaciones).then(() => {
            if (descripcionActualizada) {
               this.toastr.success('Descripción(es) actualizada(s) exitosamente', 'Ok');
               this.search();
               this.evidenciasCambios.emit();
               this.dataActualizada.emit();
               //this.generalService.emitRefresh();
            } else {
               //this.toastr.info('No se realizaron cambios en las descripciones.', 'Información');
            }
         });
      } else {
         console.error('idEmprendedor is null');
      }
   }


   search() {
      let resA3Filter = new RespuestaA3Filter();
      resA3Filter.aaaId = this.idActividad.toString();
      resA3Filter.reaEmpId = this.idEmprendedor.toString();
      this.respuestaA3Service.load(resA3Filter).subscribe(() => {
         this.createFormGroup();
      });
   }



   setFilename(files: any, index: number) {
      if (files[0]) {
         this.fileNames[index] = files[0].name;
      }
   }
}
