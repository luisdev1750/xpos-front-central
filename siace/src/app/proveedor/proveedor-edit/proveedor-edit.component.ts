import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../proveedor';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-proveedor-edit',
  standalone: false,
  templateUrl: './proveedor-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class ProveedorEditComponent implements OnInit {
  id!: string;
  proveedor!: Proveedor;
  ciudadList: any = [];
  coloniasList: any = [];
  ciudadId = 0;
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<ProveedorEditComponent>,
    private proveedorService: ProveedorService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedor = data.proveedor;
  }

  ngOnInit() {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.proveedorService.findAllCities().subscribe(
      (res) => {
        this.ciudadList = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  OnCiudadChange(event: any) {
    console.log('on change');

    this.proveedor.pveCiuId = event.value;
    this.getColonias(event.value);
  }
  onColoniaChange(event: any) {
    this.proveedor.pveColId = event.value;
  }
  getColonias(idColonia: string) {
    this.proveedorService.findColonia(idColonia).subscribe(
      (res) => {
        console.log(res);
        this.coloniasList = res;
        if (res.length > 0) {
          this.ciudadId = res[0].colCiuId;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /*Métodos*/

  save() {
    const provedorSaved: Proveedor = {
      ...this.proveedor,
      pveCiuId: this.ciudadId.toString(),
    };
    this.proveedorService.save(provedorSaved).subscribe({
      next: (result) => {
        if (Number(result) > 0) {
          this.toastr.success(
            'El proveedor ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.proveedorService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
