import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalFilter } from '../sucursal-filter';
import { SucursalService } from '../sucursal.service';
import { Sucursal } from '../sucursal';
import { SucursalEditComponent } from '../sucursal-edit/sucursal-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../proveedor/proveedor.service';
import { EmpresaFilter } from '../../empresa/empresa-filter';
import { EmpresaService } from '../../empresa/empresa.service';

@Component({
  selector: 'app-sucursal',
  standalone: false,
  templateUrl: 'sucursal-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class SucursalListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'sucId',
    'sucNombre',
    'sucNumero',
    'sucCalle',
    'sucCiuNombre',
    'sucColNombre',
    'sucEmpNombre',
    'actions',
  ];

  filter = new SucursalFilter();
  empresasList: any = [];
  estadosList: any = [];
  municipiosList: any = [];
  ciudadesList: any = [];
  coloniasList: any = [];

  private subs!: Subscription;

  constructor(
    private sucursalService: SucursalService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private proveedorService: ProveedorService,
    private empresasService: EmpresaService
  ) {
    this.subs = this.sucursalService.getIsUpdated().subscribe(() => {
      this.search();
    });

    // Inicializar filtros
    this.filter.sucId = '0';
    this.filter.sucEmpId = '0';
    this.filter.sucEstId = '0';
    this.filter.sucMunId = '0';
    this.filter.sucCiuId = '0';
    this.filter.sucColId = '0';
  }

  ngOnInit() {
    this.loadCatalogs();
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    // Cargar empresas

    // Cargar estados
    this.proveedorService.findAllEstados().subscribe(
      (res) => {
        console.log('Estados cargados:', res);
        this.estadosList = res;
      },
      (error) => {
        console.error('Error cargando estados:', error);
      }
    );

    this.empresasService.findAll().subscribe(
      (res) => {
        console.log(res);
        this.empresasList = res; 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onEmpresaChange(event: any) {
    this.filter.sucEmpId = event.value;
    this.search();
  }

  onEstadoChange(event: any) {
    this.filter.sucEstId = event.value;
    this.filter.sucMunId = '0';
    this.filter.sucCiuId = '0';
    this.filter.sucColId = '0';

    // Limpiar listas dependientes
    this.municipiosList = [];
    this.ciudadesList = [];
    this.coloniasList = [];

    if (event.value !== '0') {
      this.getMunicipios(Number(event.value));
    }
    this.search();
  }

  onMunicipioChange(event: any) {
    this.filter.sucMunId = event.value;
    this.filter.sucCiuId = '0';
    this.filter.sucColId = '0';

    // Limpiar listas dependientes
    this.ciudadesList = [];
    this.coloniasList = [];

    if (event.value !== '0') {
      this.getCiudades(Number(event.value));
    }
    this.search();
  }

  onCiudadChange(event: any) {
    this.filter.sucCiuId = event.value;
    this.filter.sucColId = '0';

    // Limpiar lista dependiente
    this.coloniasList = [];

    if (event.value !== '0') {
      this.getColonias(Number(event.value));
    }
    this.search();
  }

  onColoniaChange(event: any) {
    this.filter.sucColId = event.value;
    this.search();
  }

  getMunicipios(estId: number) {
    this.proveedorService.findMunicipios(estId).subscribe(
      (res) => {
        console.log('Municipios cargados:', res);
        this.municipiosList = res;
      },
      (error) => {
        console.error('Error cargando municipios:', error);
      }
    );
  }

  getCiudades(munId: number) {
    this.proveedorService.findCiudades(munId).subscribe(
      (res) => {
        console.log('Ciudades cargadas:', res);
        this.ciudadesList = res;
      },
      (error) => {
        console.error('Error cargando ciudades:', error);
      }
    );
  }

  getColonias(ciuId: number) {
    this.proveedorService.findColonias(ciuId).subscribe(
      (res) => {
        console.log('Colonias cargadas:', res);
        this.coloniasList = res;
      },
      (error) => {
        console.error('Error cargando colonias:', error);
      }
    );
  }

  get sucursalList(): Sucursal[] {
    return this.sucursalService.sucursalList;
  }

  add() {
    let newSucursal: Sucursal = new Sucursal();
    this.edit(newSucursal);
  }

  delete(sucursal: Sucursal): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar la sucursal?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sucursalService.delete(sucursal).subscribe({
          next: (result) => {
            if (
              result?.sucId != null &&
              result?.sucId != undefined &&
              result?.sucId > 0
            ) {
              this.toastr.success(
                'La sucursal ha sido eliminada exitosamente',
                'Transacción exitosa'
              );
              this.sucursalService.setIsUpdated(true);
            } else {
              this.toastr.error('Ha ocurrido un error', 'Error');
            }
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Sucursal) {
    this.dialog.open(SucursalEditComponent, {
      data: { sucursal: JSON.parse(JSON.stringify(ele)) },
      height: '600px',
      width: '800px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.sucursalService.load(this.filter);
  }
}
