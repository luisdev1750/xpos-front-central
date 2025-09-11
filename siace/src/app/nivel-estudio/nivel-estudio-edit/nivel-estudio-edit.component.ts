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
import { NivelEstudio } from '../nivel-estudio';
import { NivelEstudioService } from '../nivel-estudio.service';


@Component({
  selector: 'app-nivel-estudio-edit',
  templateUrl: './nivel-estudio-edit.component.html',
  styleUrls: ['nivel-estudio-edit.component.css']
})
export class NivelEstudioEditComponent implements OnInit {

   id!: string;
   nivelEstudio!: NivelEstudio;
   nivelEstudioCopia!: NivelEstudio;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<NivelEstudioEditComponent>,
      private nivelEstudioService: NivelEstudioService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: NivelEstudio) {
      this.nivelEstudio=data;
      this.nivelEstudioCopia = JSON.parse(JSON.stringify(data));
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.nivelEstudioService.save(this.nivelEstudioCopia).subscribe(
         nivelEstudio => {
            this.nivelEstudio = nivelEstudio;
			this.toastr.success('El nivelEstudio ha sido guardado exitosamente', 'Transacción exitosa');
            this.nivelEstudioService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
