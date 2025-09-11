import { Component, Inject, Input, OnInit, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Version } from '../version';
import { VersionService } from '../version.service';


@Component({
  selector: 'app-version-edit',
  templateUrl: './version-edit.component.html',
  styleUrls: ['./version-edit.component.css']
})
export class VersionEditComponent implements OnInit {
   @Input('veaId') veaId!: number;
   @Input('veaActivo') veaActivo!: boolean;
   @Input('veaFechaActivacion') veaFechaActivacion!: DateTime;
   id!: number;
   version!: Version;
   estatusVersion!: boolean;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<VersionEditComponent>,
      private versionService: VersionService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Version) {
      this.version=data;
      this.estatusVersion = data.veaActivo;
      this.veaId = this.version.veaId;
      this.veaActivo = this.version.veaActivo;
      this.veaFechaActivacion = this.version.veaFechaActivacion;
   }


   ngOnInit() {
      if(!this.version.veaId ){
         this.version.veaActivo = false;
      }
      if(!this.version.veaId ){
         this.version.veaActivo = false;
      }
      console.log('Estatus de esta version: ', this.veaActivo);
      console.log('Id de version: ', this.veaId);
   }


   /*Métodos*/
   save() {
      if (typeof this.version.veaFecha !== 'string') {
         // Obtener la fecha seleccionada del mat-datepicker
         const selectedDate = DateTime.fromJSDate(this.version.veaFecha as Date);
     
         // Obtener la hora actual
         const currentTime = DateTime.now();
     
         // Combina la fecha seleccionada con la hora actual
         const fechaConHoraActual = selectedDate.set({
           hour: currentTime.hour,
           minute: currentTime.minute,
           second: currentTime.second,
           millisecond: currentTime.millisecond
         }).toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
     
         // Asignar la fecha formateada a version.veaFecha
         this.version.veaFecha = fechaConHoraActual;
      }
      this.versionService.save(this.version).subscribe(
         version => {
            this.version = version;
			   this.toastr.success('La version ha sido guardada exitosamente', 'Transacción exitosa');
            this.versionService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
