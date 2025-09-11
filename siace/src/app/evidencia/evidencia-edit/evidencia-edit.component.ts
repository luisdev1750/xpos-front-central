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
import { Evidencia } from '../evidencia';
import { EvidenciaService } from '../evidencia.service';


@Component({
  selector: 'app-evidencia-edit',
  templateUrl: './evidencia-edit.component.html',
  styleUrls: ['./evidencia-edit.component.css']
})
export class EvidenciaEditComponent implements OnInit {
   id!: string;
   evidencia!: Evidencia;
   veaFechaActivacion!: DateTime;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<EvidenciaEditComponent>,
      private evidenciaService: EvidenciaService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.evidencia=data.evidencia;
      this.veaFechaActivacion= data.veaFechaActivacion;
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.evidenciaService.save(this.evidencia).subscribe(
         evidencia => {
            this.evidencia = evidencia;
			this.toastr.success('El evidencia ha sido guardado exitosamente', 'Transacción exitosa');
            this.evidenciaService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
