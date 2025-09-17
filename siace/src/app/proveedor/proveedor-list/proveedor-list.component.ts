import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProveedorFilter } from '../proveedor-filter';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../proveedor';
import { ProveedorEditComponent } from '../proveedor-edit/proveedor-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-proveedor',
  standalone: false,
  templateUrl: 'proveedor-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class ProveedorListComponent implements OnInit {
  displayedColumns = [
    'pveId',
    'pveNombre',
    'pveActivo',
    'pveCalle',
    'pveNumeroExterior',
    'pveNumeroInterior',
    'pveCiuId',
    'pveColId',
    'pveTelefono',
    'pveCorreoElectronico',
    'pveObservaciones',
    'pveNumero',
    'actions',
  ];
  filter = new ProveedorFilter();
  ciudadList: any = [];
  coloniasList: any = [];
  private subs!: Subscription;
  
  /* Inicialización */

  constructor(
    private proveedorService: ProveedorService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.proveedorService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.pveId = '0';
    this.filter.pveActivo = 'all';
    this.filter.pveCiuId = '0';
    this.filter.pveColId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  onChangeActivo(event: any){
      this.filter.pveActivo = event.value;
      this.search(); 
  }

  loadCatalogs() {
    this.proveedorService.findAllCities().subscribe(
      (res) => {
        console.log('Finding catalogs');

        console.log(res);
        this.ciudadList = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /* Accesors */

  get proveedorList(): Proveedor[] {
    return this.proveedorService.proveedorList;
  }

  /* Métodos */
  onChangeCiudad(event: any) {
    this.filter.pveCiuId = event.value;
    this.getColonias(event.value);
    this.search();
  }
  onColoniaChange(event: any) {
    this.filter.pveColId = event.value;
    this.search();
  }
  getColonias(idColonia: string) {
    this.proveedorService.findColonia(idColonia).subscribe(
      (res) => {
        console.log(res);
        this.coloniasList = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  add() {
    let newProveedor: Proveedor = new Proveedor();

    this.edit(newProveedor);
  }

  delete(proveedor: Proveedor): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el proveedor?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.proveedorService.delete(proveedor).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El proveedor ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.proveedorService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Proveedor) {
    this.dialog.open(ProveedorEditComponent, {
      data: { proveedor: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.proveedorService.load(this.filter);
  }
}
