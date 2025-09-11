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
import { TipoAspectoService } from '../../tipo-aspecto/tipo-aspecto.service';
import { TipoSesion } from '../tipo-sesion';
import { TipoSesionService } from '../tipo-sesion.service';


@Component({
  selector: 'app-tipo-sesion-edit',
  templateUrl: './tipo-sesion-edit.component.html',
  styleUrls: ['tipo-sesion-edit.component.css']
})
export class TipoSesionEditComponent implements OnInit {

   id!: string;
   tipoSesion!: TipoSesion;
   tipoSesionCopia!: TipoSesion;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<TipoSesionEditComponent>,
      private tipoSesionService: TipoSesionService,
      private tiaService: TipoAspectoService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: TipoSesion) {
      this.tipoSesion=data;
      this.tipoSesionCopia = JSON.parse(JSON.stringify(data));
   }


   ngOnInit() {
      this.tiaService.findAll().subscribe({
         next: tipoAspectoList => {
            //this.tiaService.tipoAspectoList = tipoAspectoList;
            this.tiaService.tipoAspectoList = tipoAspectoList.sort((a, b) => a.tiaNombre.localeCompare(b.tiaNombre));
         },
         error: err => {
            this.toastr.error(err.error.mensaje, 'Error');
         }
      })
   }


   /* Accesors */

   get tiaModel(){
      //console.log(this.tiaService.tipoAspectoList);   
      return this.tiaService.tipoAspectoList;
   }

   /*Métodos*/
   
   save() {
      this.tipoSesionService.save(this.tipoSesionCopia).subscribe(
         tipoSesion => {
            this.tipoSesion = tipoSesion;
			this.toastr.success('El tipoSesion ha sido guardado exitosamente', 'Transacción exitosa');
            this.tipoSesionService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
