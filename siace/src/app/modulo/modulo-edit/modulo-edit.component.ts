import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ModuloService } from '../modulo.service';
import { Modulo } from '../modulo';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-modulo-edit',
  templateUrl: './modulo-edit.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }'
  ]
})
export class ModuloEditComponent implements OnInit {

   id!: string;
   modulo!: Modulo;

   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<ModuloEditComponent>,
      private moduloService: ModuloService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: Modulo) {
      this.modulo=data;
   }


   ngOnInit() {
   }

   /*Métodos*/
   
   save() {
      this.moduloService.save(this.modulo).subscribe(
         result => {
            if (Number(result) > 0) {
			   this.toastr.success('El modulo ha sido guardado exitosamente', 'Transacción exitosa');
               this.moduloService.setIsUpdated(true);
               this.dialogRef.close();
			}
			else this.toastr.error('Ha ocurrido un error', 'Error');
         },
         err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
         }
      );
   }
}
