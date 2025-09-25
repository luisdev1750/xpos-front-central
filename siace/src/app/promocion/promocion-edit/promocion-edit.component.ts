import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PromocionService } from '../promocion.service';

import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Promocion } from '../promocion';
import { SucursalService } from '../../sucursal/sucursal.service';
import { TipoPromocionService } from '../../tipo-promocion/tipo-promocion.service';
import { TipoPagoService } from '../../tipo-pago/tipo-pago.service';
import { TipoSubpagoService } from '../../tipo-subpago/tipo-subpago.service';

@Component({
  selector: 'app-promocion-edit',
  standalone: false,
  templateUrl: './promocion-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class PromocionEditComponent implements OnInit {
  id!: string;
  promocion!: Promocion;
  listTipoPagos: any[] = [];
  listSubtipoPagos: any[] = [];
  listTiposPromocones: any[] = [];
  listSucursales : any[] = [];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<PromocionEditComponent>,
    private promocionService: PromocionService,
    private toastr: ToastrService,
    private sucursalService: SucursalService,
    private tipoPromocionService: TipoPromocionService,
    private tipoPagoService: TipoPagoService,
    private tipoSubpagoService: TipoSubpagoService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocion = data.promocion;
    console.log("Promocion seleccionada");
    console.log(this.promocion);
    console.log(data.promocion);
    
    
    
  }

  ngOnInit() {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.sucursalService.findAll().subscribe(
      (res) => {
        console.log('Response sucursal');
        console.log(res);
        this.listSucursales = res; 
      },
      (error) => {
        console.log(error);
      }
    );
    this.tipoPagoService.findAll().subscribe(
      (res) => {
        console.log('Todos los tipos de pago');
        console.log(res);
        this.listTipoPagos = res;
          if (this.promocion.pmoTpaId && this.promocion.pmoTpaId > 0) {
          this.getSubtipoPagos(this.promocion.pmoTpaId);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    /*
   find(filter: TipoPromocionFilter): Observable<TipoPromocion[]> {
      const url = `${this.api}/${filter.tprId}/${filter.tprActivo}`;

*/
    this.tipoPromocionService
      .find({
        tprId: '0',
        tprActivo: 'all',
      })
      .subscribe(
        (res) => {
          console.log('respuesta de tipo promociones');
          console.log(res);
          this.listTiposPromocones = res;
        },
        (error) => {
          console.log('Error al importar tipos promociones');
          console.log(error);
        }
      );
  }
  onTipoPagoChange(event: any) {
    this.promocion.pmoTpaId = event.value;
    this.promocion.pmoSpaId = 0;
    this.getSubtipoPagos(this.promocion.pmoTpaId ?? 0);
  }
  onTipoPromocionesChange(event: any){
   this.promocion.pmoTprId = event.value; 
  }

  getSubtipoPagos(idTipoPago: number) {
    this.tipoSubpagoService.findByPagoId(idTipoPago.toString()).subscribe(
      (res) => {
        console.log('res subtipo pagos');
        console.log(res);
        this.listSubtipoPagos = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onSubpagoChange(event: any) {
    this.promocion.pmoSpaId = event.value;
  }
  /*Métodos*/
  onSucursalChange(event: any){
   this.promocion.pmoSucId = event.value; 

  }
 save() {
  console.log("información por enviar");
  
  // Crear una copia de la promoción para no modificar el objeto original
  const promocionToSave = { ...this.promocion };
  
  // Convertir a null los IDs que sean 0, excepto pmoSucId y pmoId
  if (promocionToSave.pmoTprId === 0) promocionToSave.pmoTprId = null;
  if (promocionToSave.pmoTpaId === 0) promocionToSave.pmoTpaId = null;
  if (promocionToSave.pmoSpaId === 0) promocionToSave.pmoSpaId = null;
  
  console.log(promocionToSave);

  this.promocionService.save(promocionToSave).subscribe({
    next: (result) => {
      if (result?.pmoSucId != null && result?.pmoSucId !== undefined && result?.pmoSucId > 0) {
        this.toastr.success(
          'El promoción obsequio ha sido guardado exitosamente',
          'Transacción exitosa'
        );
        this.promocionService.setIsUpdated(true);
        this.dialogRef.close();
      } else this.toastr.error('Ha ocurrido un error', 'Error');
    },
    error: (err) => {
      this.toastr.error('Ha ocurrido un error', 'Error');
    },
  });
}
}
