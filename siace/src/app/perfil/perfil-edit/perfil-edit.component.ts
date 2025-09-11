import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PerfilService } from '../perfil.service';
import { Perfil } from '../perfil';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PerfilFilter } from '../perfil-filter';

@Component({
   selector: 'app-perfil-edit',
   standalone: false,
   templateUrl: './perfil-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class PerfilEditComponent implements OnInit {

   id!: string;
   perfil!: Perfil;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<PerfilEditComponent>,
      private perfilService: PerfilService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.perfil=data.perfil;
      
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.perfilService.save(this.perfil).subscribe({
         next:  result => {
            if (result?.perId !== undefined && result?.perId !== null && Number(result.perId) >= 0) {
               this.toastr.success('El perfil ha sido guardado exitosamente', 'Transacción exitosa');
               this.perfilService.setIsUpdated(true);
               this.dialogRef.close();
            }
            else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      });
   }
}
