import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MarcaService } from '../marca.service';
import { Marca } from '../marca';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-marca-edit',
   standalone: false,
   templateUrl: './marca-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class MarcaEditComponent implements OnInit {

   id!: string;
   marca!: Marca;


   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<MarcaEditComponent>,
      private marcaService: MarcaService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      

         this.marca = { ...data.marca };
      
  
   }


   ngOnInit() {
   }


   /*Métodos*/
   
   save() {
      this.marcaService.save(this.marca).subscribe({
         next: result => {
            // Validación similar al BancoEditComponent
            if (result?.marId !== undefined && result?.marId !== null && Number(result.marId) >= 0) {
               this.toastr.success('La marca ha sido guardada exitosamente', 'Transacción exitosa');
               this.marcaService.setIsUpdated(true);
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
