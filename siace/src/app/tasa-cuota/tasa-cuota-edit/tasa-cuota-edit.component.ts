import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TasaCuotaService } from '../tasa-cuota.service';
import { TasaCuota } from '../tasa-cuota';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
   selector: 'app-tasa-cuota-edit',
   standalone: false,
   templateUrl: './tasa-cuota-edit.component.html',
   styles: [
      'form { display: flex; flex-direction: column; min-width: 500px; }',
      'form > * { width: 100% }',
      '.mat-mdc-form-field {width: 100%;}'
   ]
})
export class TasaCuotaEditComponent implements OnInit {

   id!: string;
   tasaCuota!: TasaCuota;

   listImpuestosFilter: any[] = [];
  listTiposFactoresFilter: any[] = [];
   /* Constructores */
   
   constructor(
      private dialogRef: MatDialogRef<TasaCuotaEditComponent>,
      private tasaCuotaService: TasaCuotaService,
	   private toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.tasaCuota=data.tasaCuota;
      this.listImpuestosFilter = data.listImpuestosFilter;
      this.listTiposFactoresFilter = data.listTiposFactoresFilter;


   }


   ngOnInit() {
   }
   OnFactorChange(event: any) {
      this.tasaCuota.tocTfaId = event.value;
   }
   OnImpuestoChange(event: any) {
      this.tasaCuota.tocImpId = event.value;
   }
   OnActivoChange(event: any) {
      this.tasaCuota.tocActivo = event.value;
   }

   /*Métodos*/
   
   save() {
      this.tasaCuotaService.save(this.tasaCuota).subscribe({
         next:  result => {
            if (result?.tocId !== undefined && result?.tocId !== null && Number(result.tocId) >= 0) {
               this.toastr.success('El tasa o cuota ha sido guardado exitosamente', 'Transacción exitosa');
               this.tasaCuotaService.setIsUpdated(true);
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
