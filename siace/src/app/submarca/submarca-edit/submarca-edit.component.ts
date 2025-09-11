import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SubmarcaService } from '../submarca.service';
import { Submarca } from '../submarca';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Marca } from '../../marca/marca';

@Component({
  selector: 'app-submarca-edit',
  standalone: false,
  templateUrl: './submarca-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class SubmarcaEditComponent implements OnInit {
  id!: string;
  submarca!: Submarca;
  marcaListsFilter: Marca[] = [];

  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<SubmarcaEditComponent>,
    private submarcaService: SubmarcaService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.submarca = data.submarca;
    this.marcaListsFilter = data.marcaListsFilter;
  }

  ngOnInit() {}

  onMarcaChange(event: any) {
    this.submarca.smaMarId = event.value;
  }
  onActivoChange(event: any) {
    this.submarca.smaActivo = event.value;
  }
  /*Métodos*/

  save() {
    this.submarcaService.save(this.submarca).subscribe({
      next: (result) => {
        if (
          result?.smaId !== undefined &&
          result?.smaId !== null &&
          Number(result.smaId) >= 0
        ) {
          this.toastr.success(
            'El submarca ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.submarcaService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
