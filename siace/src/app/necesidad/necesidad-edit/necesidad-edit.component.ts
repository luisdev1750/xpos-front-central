import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Necesidad } from '../necesidad';
import { NecesidadService } from '../necesidad.service';


@Component({
  selector: 'app-necesidad-edit',
  templateUrl: './necesidad-edit.component.html',
  styleUrls: ['./necesidad-edit.component.css']
})
export class NecesidadEditComponent implements OnInit {

   id!: string;
   necesidad!: Necesidad;
   necesidadCopia!: Necesidad;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<NecesidadEditComponent>,
      private necesidadService: NecesidadService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Necesidad) {
      this.necesidad=data;
      this.necesidadCopia = JSON.parse(JSON.stringify(data));
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.necesidadService.save(this.necesidadCopia).subscribe(
         necesidad => {
            this.necesidad = necesidad;
			this.toastr.success('El necesidad ha sido guardado exitosamente', 'Transacción exitosa');
            this.necesidadService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
