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
import { Objetivo } from '../objetivo';
import { ObjetivoService } from '../objetivo.service';


@Component({
  selector: 'app-objetivo-edit',
  templateUrl: './objetivo-edit.component.html',
  styleUrls: ['objetivo-edit.component.css']
})
export class ObjetivoEditComponent implements OnInit {

   id!: string;
   objetivo!: Objetivo;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ObjetivoEditComponent>,
      private objetivoService: ObjetivoService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Objetivo) {
      this.objetivo=data;
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.objetivoService.save(this.objetivo).subscribe(
         objetivo => {
            this.objetivo = objetivo;
			this.toastr.success('El objetivo ha sido guardado exitosamente', 'Transacción exitosa');
            this.objetivoService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
