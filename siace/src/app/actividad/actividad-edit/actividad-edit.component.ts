import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { Nivel } from '../../nivel/nivel';
import { Pilar } from '../../pilar/pilar';
import { Actividad } from '../actividad';
import { ActividadService } from '../actividad.service';


@Component({
   selector: 'app-actividad-edit',
   templateUrl: './actividad-edit.component.html',
   styleUrls: ['./actividad-edit.component.css']
})
export class ActividadEditComponent implements OnInit {

   id!: string;
   actividad!: Actividad;
   nivModel!: Nivel[];
   pilModel!: Pilar[];
   aaaModel!: Actividad[];
   veaModel!: number;
   veaFechaActivacion!: DateTime;


   /* Constructores */

   constructor(
      private dialogRef: MatDialogRef<ActividadEditComponent>,
      private actividadService: ActividadService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.actividad = data.actividad;
      this.veaModel = data.veaModel;
      this.nivModel = data.nivModel;
      this.pilModel = data.pilModel;
      this.aaaModel = data.aaaModel;
      this.veaFechaActivacion = data.veaFechaActivacion;
      this.aaaModel = this.aaaModel.filter(f => f.aaaPilId == this.actividad.aaaPilId && f.aaaNivId == this.actividad.aaaNivId && f.aaaId !== this.actividad.aaaId );// && f.aaaVeaId == this.actividad.aaaVeaId
      console.log('Lista de acts para predecesora: ', this.aaaModel);
      if (this.actividad.aaaPredecesora == undefined) this.actividad.aaaPredecesora = 0;
   }


   ngOnInit() {
   }

   /*Métodos*/
   onPilarChange(){
      this.aaaModel = this.data.aaaModel.filter((f:Actividad) => 
         f.aaaNivId === this.actividad.aaaNivId &&
         f.aaaPilId === this.actividad.aaaPilId &&
         f.aaaId !== this.actividad.aaaId
      );
      console.log('Lista de acts para predecesora Filtrada: ', this.aaaModel);
   }


   save() {
      this.actividadService.save(this.actividad).subscribe(
         actividad => {
            this.actividad = actividad;
            this.toastr.success('El actividad ha sido guardado exitosamente', 'Transacción exitosa');
            this.actividadService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
