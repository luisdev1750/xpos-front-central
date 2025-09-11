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
import { TipoAspecto } from '../tipo-aspecto';
import { TipoAspectoService } from '../tipo-aspecto.service';


@Component({
  selector: 'app-tipo-aspecto-edit',
  templateUrl: './tipo-aspecto-edit.component.html',
  styleUrls: ['tipo-aspecto-edit.component.css']

})
export class TipoAspectoEditComponent implements OnInit {

   id!: string;
   tipoAspecto!: TipoAspecto;
   tipoAspectoCopia!: TipoAspecto;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<TipoAspectoEditComponent>,
      private tipoAspectoService: TipoAspectoService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: TipoAspecto) {
      this.tipoAspecto=data;
      this.tipoAspectoCopia = JSON.parse(JSON.stringify(data));
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.tipoAspectoService.save(this.tipoAspectoCopia).subscribe(
         tipoAspecto => {
            this.tipoAspecto = tipoAspecto;
			this.toastr.success('El tipoAspecto ha sido guardado exitosamente', 'Transacción exitosa');
            this.tipoAspectoService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
