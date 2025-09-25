import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromocionObsequioFilter } from '../promocion-obsequio-filter';
import { PromocionObsequioService } from '../promocion-obsequio.service';
import { PromocionObsequio } from '../promocion-obsequio';
import { PromocionObsequioEditComponent } from '../promocion-obsequio-edit/promocion-obsequio-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-promocion-obsequio',
  standalone: false,
  templateUrl: 'promocion-obsequio-list.component.html',
  styles: [
    'table { }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class PromocionObsequioListComponent implements OnInit {
  displayedColumns = [
    'pobId',
    'pobPmoId',
    'pobFamId',
    'pobPreId',
    'pobProId',
    'actions',
  ];
  filter = new PromocionObsequioFilter();
  fechaValida: boolean = false;
  promocionId: string = '';
  sucursalId: string  = '';
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private promocionObsequioService: PromocionObsequioService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.subs = this.promocionObsequioService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.pobId = '0';
  }

  ngOnInit() {
    
    // Recibir el ID desde los parámetros de ruta
    this.route.params.subscribe((params) => {
      this.promocionId = params['id'];
      this.filter.pobPmoId = this.promocionId;  
    });

   
    this.route.queryParams.subscribe((params) => {
      this.fechaValida = params['fechaValida'] === 'true';
      console.log('Fecha válida recibida:', this.fechaValida);
    });


    this.route.queryParams.subscribe((params) => {
      this.sucursalId = params['sucursalId'] ;
      console.log('Sucursal recibida:', this.sucursalId);
      
     
    });

    this.search();

  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs(){
     }
  /* Accesors */

  get promocionObsequioList(): PromocionObsequio[] {
    return this.promocionObsequioService.promocionObsequioList;
  }

  /* Métodos */

  add() {
    let newPromocionObsequio: PromocionObsequio = new PromocionObsequio();

    this.edit(newPromocionObsequio);
  }

  delete(promocionObsequio: PromocionObsequio): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el promoción obsequio?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.promocionObsequioService.delete(promocionObsequio).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El promoción obsequio ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.promocionObsequioService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: PromocionObsequio) {
    this.dialog.open(PromocionObsequioEditComponent, {
      data: { promocionObsequio: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.promocionObsequioService.load(this.filter);
  }
}
