import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AuditoriaService } from '../auditoria.service';
import { Auditoria } from '../auditoria';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-auditoria-edit',
  templateUrl: './auditoria-edit.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }'
  ]
})
export class AuditoriaEditComponent implements OnInit {

   id!: string;
   auditoria!: Auditoria;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<AuditoriaEditComponent>,
      private auditoriaService: AuditoriaService,
	  private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Auditoria) {
      this.auditoria=data;
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.auditoriaService.save(this.auditoria).subscribe(
         auditoria => {
            this.auditoria = auditoria;
			this.toastr.success('El auditoria ha sido guardado exitosamente', 'Transacción exitosa');
            this.auditoriaService.setIsUpdated(true);
            this.dialogRef.close();
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
