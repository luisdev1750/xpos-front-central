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
import { PromocionDetalleService } from '../../promocion-detalle/promocion-detalle.service';

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
  listSucursales: any[] = [];
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<PromocionEditComponent>,
    private promocionService: PromocionService,
    private toastr: ToastrService,
    private sucursalService: SucursalService,
    private tipoPromocionService: TipoPromocionService,
    private tipoPagoService: TipoPagoService,
    private tipoSubpagoService: TipoSubpagoService,
    private promocionDetalleService: PromocionDetalleService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocion = data.promocion;
    console.log('Promocion seleccionada');
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
  onTipoPromocionesChange(event: any) {
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
  onSucursalChange(event: any) {
    this.promocion.pmoSucId = event.value;
  }
  save() {
    console.log('información por enviar');

    const promocionToSave = { ...this.promocion };

    if (promocionToSave.pmoTprId === 0) promocionToSave.pmoTprId = null;
    if (promocionToSave.pmoTpaId === 0) promocionToSave.pmoTpaId = null;
    if (promocionToSave.pmoSpaId === 0) promocionToSave.pmoSpaId = null;

    let cantidadCompra = null;
    let cantidadObsequio = null;
    let porcentajeDescuento = null;
    console.log('información pago:');
    console.log(this.listTiposPromocones);

    console.log(
      this.listTiposPromocones.find(
        (tp) => tp.tprId == promocionToSave.pmoTprId
      ).tprClave == 'PROMO_NXM'
    );

    if (
      this.listTiposPromocones?.find(
        (tp) => tp.tprId == promocionToSave.pmoTprId
      )?.tprClave == 'PROMO_NXM'
    ) {
      const regexPromocion = /(\d+)\s*x\s*(\d+)/i;
      const match = promocionToSave.pmoNombre.match(regexPromocion);

      if (!match) {
        this.toastr.error(
          'El nombre de la promoción debe incluir un formato NxM (ejemplo: 3x2, 2x1)',
          'Formato de promoción inválido'
        );
        return;
      }

      const cantidadLlevada = parseInt(match[1]);
      const cantidadPagada = parseInt(match[2]);

      if (cantidadLlevada <= cantidadPagada) {
        this.toastr.error(
          `La promoción ${cantidadLlevada}x${cantidadPagada} no es válida. Debe llevarse más unidades de las que se pagan (ejemplo: 3x2, 2x1)`,
          'Promoción incoherente'
        );
        return;
      }

      cantidadCompra = cantidadLlevada;
      cantidadObsequio = cantidadLlevada - cantidadPagada;

      console.log(`Promoción válida: ${cantidadLlevada}x${cantidadPagada}`);
    }
  
    if (   this.listTiposPromocones?.find(
        (tp) => tp.tprId == promocionToSave.pmoTprId
      )?.tprClave == "PROMO_DIR") {
      const regexDescuento = /(\d+)\s*%/i;
      const match = promocionToSave.pmoNombre.match(regexDescuento);

      if (!match) {
        this.toastr.error(
          'El nombre de la promoción debe incluir un porcentaje de descuento (ejemplo: Descuento 20%, 50% de descuento)',
          'Formato de promoción inválido'
        );
        return;
      }

      porcentajeDescuento = parseInt(match[1]);

      if (porcentajeDescuento <= 0 || porcentajeDescuento > 100) {
        this.toastr.error(
          `El porcentaje de descuento ${porcentajeDescuento}% no es válido. Debe estar entre 1% y 100%`,
          'Porcentaje inválido'
        );
        return;
      }

      console.log(`Promoción de descuento válida: ${porcentajeDescuento}%`);
    }


    // Guardar la promoción padre
    this.promocionService.save(promocionToSave).subscribe({
      next: (result) => {
        if (
          result?.pmoSucId != null &&
          result?.pmoSucId !== undefined &&
          result?.pmoSucId > 0
        ) {
          // Si es actualización (tiene pmoId), verificar si hay detalles para actualizar
          if (promocionToSave.pmoId && promocionToSave.pmoId > 0) {
            this.actualizarDetallesSiExisten(
              promocionToSave.pmoId,
              promocionToSave.pmoTprId ?? 0,
              cantidadCompra,
              cantidadObsequio,
              porcentajeDescuento
            );
          } else {
            // Es nuevo registro, solo mostrar éxito
            this.mostrarExitoYCerrar();
          }
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  private actualizarDetallesSiExisten(
    pmoId: number,
    tipoPromocion: number,
    cantidadCompra: number | null,
    cantidadObsequio: number | null,
    porcentajeDescuento: number | null
  ) {
    // Primero verificar si existen detalles
    this.promocionDetalleService.getByPromocionId(pmoId).subscribe({
      next: (detalles) => {
        if (detalles && detalles.length > 0) {
          // Hay detalles, actualizar según el tipo
          if (
            tipoPromocion === 2 &&
            cantidadCompra !== null &&
            cantidadObsequio !== null
          ) {
            // Actualizar detalles NxM
            this.promocionDetalleService
              .actualizarDetallesNxM(pmoId, cantidadCompra, cantidadObsequio)
              .subscribe({
                next: () => {
                  this.toastr.success(
                    'La promoción y sus detalles han sido actualizados exitosamente',
                    'Transacción exitosa'
                  );
                  this.mostrarExitoYCerrar();
                },
                error: (err) => {
                  console.error('Error actualizando detalles NxM:', err);
                  this.toastr.warning(
                    'La promoción se guardó pero hubo un error al actualizar los detalles',
                    'Advertencia'
                  );
                  this.mostrarExitoYCerrar();
                },
              });
          } else if (tipoPromocion === 3 && porcentajeDescuento !== null) {
            // Actualizar detalles de descuento
            this.promocionDetalleService
              .actualizarDetallesDescuento(pmoId, porcentajeDescuento)
              .subscribe({
                next: () => {
                  this.toastr.success(
                    'La promoción y sus detalles han sido actualizados exitosamente',
                    'Transacción exitosa'
                  );
                  this.mostrarExitoYCerrar();
                },
                error: (err) => {
                  console.error(
                    'Error actualizando detalles de descuento:',
                    err
                  );
                  this.toastr.warning(
                    'La promoción se guardó pero hubo un error al actualizar los detalles',
                    'Advertencia'
                  );
                  this.mostrarExitoYCerrar();
                },
              });
          } else {
            // Tipo obsequio (tipo 1) o no hay cambios que hacer
            this.mostrarExitoYCerrar();
          }
        } else {
          // No hay detalles, solo mostrar éxito
          this.mostrarExitoYCerrar();
        }
      },
      error: (err) => {
        console.error('Error verificando detalles:', err);
        this.mostrarExitoYCerrar();
      },
    });
  }

  private mostrarExitoYCerrar() {
    this.toastr.success(
      'La promoción ha sido guardada exitosamente',
      'Transacción exitosa'
    );
    this.promocionService.setIsUpdated(true);
    this.dialogRef.close();
  }
}
