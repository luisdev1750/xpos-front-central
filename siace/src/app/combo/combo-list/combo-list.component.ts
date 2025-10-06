import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComboService } from '../combo.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ComboEditComponent } from '../combo-edit/combo-edit.component';
import { SucursalService } from '../../sucursal/sucursal.service';
import { ComboFilter } from '../combo-filter';

@Component({
  selector: 'app-combo-list',
  standalone: false,
  templateUrl: 'combo-list.component.html',
  styles: [
    'table { min-width: 600px; width: 100%; }',
    '.mat-column-actions { flex: 0 0 150px; }',
  ],
})
export class ComboListComponent implements OnInit, OnDestroy {
  displayedColumns = ['comboId', 'comboNombre', 'sucursalId', 'precioCombo', 'comboActivo', 'actions'];
  
  filter = new ComboFilter();

  private subs!: Subscription;
  listSucursales: any[] = [];
  listCombos: any[] = [];

  constructor(
    private comboService: ComboService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalSerivice: SucursalService,
    
  ) {
    this.subs = this.comboService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.comboSucId = '0';
    this.filter.comboActivo = 'all';
  }

  ngOnInit() {
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  onSucursalChange(event: any) {
    this.filter.comboSucId = event.value;
    this.search();
  }

  onActivoChange(): void {
    this.search();
  }



  loadCatalogs() {
    // Cargar sucursales
    this.sucursalSerivice
      .find({
        sucId: '0',
        sucCiuId: '0',
        sucColId: '0',
        sucEmpId: '0',
        sucEstId: '0',
        sucMunId: '0'
      })
      .subscribe(
        (res) => {
          console.log('Sucursales cargadas:', res);
          this.listSucursales = res;
        },
        (error) => {
          console.log('Error al cargar sucursales:', error);
          this.toastr.error('Error al cargar sucursales', 'Error');
        }
      );

    // Cargar combos iniciales
    this.search();
  }

  search(): void {
    this.comboService
      .find({
        comboSucId: this.filter.comboSucId,
        comboActivo: this.filter.comboActivo,
      })
      .subscribe(
        (res) => {
          console.log('Combos cargados:', res);
          this.listCombos = res;
        },
        (error) => {
          console.log('Error al cargar combos:', error);
          this.toastr.error('Error al cargar combos', 'Error');
        }
      );
  }

  add() {
    let newCombo: any = {
      comboId: 0,
      comboNombre: '',
      comboActivo: true,
      sucursalId: 0,
      listaPrecioId: 0,
      precioCombo: 0,
      productos: []
    };

    this.edit(newCombo);
  }

  edit(combo: any) {
    this.dialog.open(ComboEditComponent, {
      data: { combo: JSON.parse(JSON.stringify(combo)) },
      height: '600px',
      width: '900px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  delete(combo: any): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: `¿Está seguro de eliminar el combo "${combo.comboNombre}"?`,
      },
    });
    
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.comboService.delete(combo).subscribe({
          next: (result) => {
            if (result.comboId > 0) {
              this.toastr.success(
                'El combo ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.search();
            } else {
              this.toastr.error('Ha ocurrido un error', 'Error');
            }
          },
          error: (err) => {
            console.error('Error al eliminar combo:', err);
            this.toastr.error('Ha ocurrido un error al eliminar', 'Error');
          },
        });
      }
    });
  }

  getSucursalNombre(sucId: number): string {
    const sucursal = this.listSucursales.find(s => s.sucId === sucId);
    return sucursal ? sucursal.sucNombre : 'N/A';
  }
}