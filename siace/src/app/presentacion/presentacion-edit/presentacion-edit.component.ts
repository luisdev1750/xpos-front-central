import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PresentacionService } from '../presentacion.service';
import { Presentacion } from '../presentacion';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-presentacion-edit',
  standalone: false,
  templateUrl: './presentacion-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class PresentacionEditComponent implements OnInit {
  id!: string;
  presentacion!: Presentacion;

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<PresentacionEditComponent>,
    private presentacionService: PresentacionService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

      this.presentacion= data.presentacion;
  }

  ngOnInit() {}

  onMarcaChange(event: any) {
    this.presentacion.preActivo = event.value;
  }
  onActivoChange(event: any) {
    this.presentacion.preActivo = event.value;
  }
  /*Métodos*/

  save() {
    this.presentacionService.save(this.presentacion).subscribe({
      next: (result) => {
        if (
          result?.preId !== undefined &&
          result?.preId !== null &&
          Number(result.preId) >= 0
        ) {
          this.toastr.success(
            'El presentacion ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.presentacionService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
