import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Giro } from '../giro';
import { GiroService } from '../giro.service';


@Component({
   selector: 'app-giro-edit',
   templateUrl: './giro-edit.component.html',
   styleUrls: ['giro-edit.component.css']
})
export class GiroEditComponent {

   id!: string;
   giro!: Giro;
   giroCopia!: Giro;

   /* Constructores */

   constructor(
      private dialogRef: MatDialogRef<GiroEditComponent>,
      private giroService: GiroService,
      private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Giro) {
      this.giro = data;
      this.giroCopia = JSON.parse(JSON.stringify(data));
   }

   /*Métodos*/

   save() {
      this.giroService.save(this.giroCopia).subscribe(
         giro => {
            this.giro = giro;
            this.toastr.success('El giro ha sido guardado exitosamente', 'Transacción exitosa');
            this.giroService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
