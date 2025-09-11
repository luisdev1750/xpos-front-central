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
import { ApplicationUser } from '../../login/login.service';
import { Nivel } from '../nivel';
import { NivelService } from '../nivel.service';


@Component({
  selector: 'app-nivel-edit',
  templateUrl: './nivel-edit.component.html',
  styleUrls: ['nivel-edit.component.css']
})
export class NivelEditComponent implements OnInit {

   id!: string;
   nivel!: Nivel;
   nivelCopia!: Nivel;
   user!: ApplicationUser;
   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<NivelEditComponent>,
      private nivelService: NivelService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Nivel) {
      this.nivel=data;
      this.nivelCopia = JSON.parse(JSON.stringify(data));
      this.user = JSON.parse(localStorage.getItem('user')!);
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      
      this.nivelService.save(this.nivelCopia).subscribe(
         nivel => {
            this.nivel = nivel;
			this.toastr.success('El nivel ha sido guardado exitosamente', 'Transacción exitosa');
            this.nivelService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
