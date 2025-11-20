import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComboService } from '../combo.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ComboEditComponent } from '../combo-edit/combo-edit.component';
import { ComboCopyDialogComponent } from '../combo-dialog/combo-copy-dialog.component';
import { SucursalService } from '../../sucursal/sucursal.service';
import { ComboFilter } from '../combo-filter';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Combo } from '../combo';

@Component({
  selector: 'app-combo-list',
  standalone: false,
  templateUrl: 'combo-list.component.html',
  styles: [
    'table { min-width: 600px; width: 100%; }',
    '.mat-column-actions { flex: 0 0 150px; }',
    '.mat-column-select { flex: 0 0 60px; }',
  ],
})
export class ComboListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'select',
    'comboNombre',
    'sucursalId',
    'precioCombo',
    'comboActivo',
    'actions',
  ];

  filter = new ComboFilter();
  selection = new SelectionModel<Combo>(true, []);

  private subs!: Subscription;
  listSucursales: any[] = [];
  listCombos: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Combo>();
  showPopup = false;
  currentProductos: any[] = [];
  popupPosition = { x: 0, y: 0 };
  private hideTimeout: any;
  private showTimeout: any;
  constructor(
    private comboService: ComboService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalSerivice: SucursalService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.comboService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.comboSucId = '0';
    this.filter.comboActivo = 'all';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private configurarPaginadorEspanol(): void {
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página';
    this.paginatorIntl.nextPageLabel = 'Siguiente página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';

    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };
  }

  ngOnInit() {
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
  }

  onSucursalChange(event: any) {
    this.filter.comboSucId = event.value;
    this.selection.clear();
    this.search();
  }

  onActivoChange(): void {
    this.selection.clear();
    this.search();
  }

  loadCatalogs() {
    this.sucursalSerivice
      .find({
        sucId: '0',
        sucCiuId: '0',
        sucColId: '0',
        sucEmpId: '0',
        sucEstId: '0',
        sucMunId: '0',
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
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
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
      productos: [],
    };

    this.edit(newCombo);
  }

  edit(combo: any) {
    this.dialog.open(ComboEditComponent, {
      data: { combo: JSON.parse(JSON.stringify(combo)), comboId: 1 },
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
              this.selection.clear();
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
    const sucursal = this.listSucursales.find((s) => s.sucId === sucId);
    return sucursal ? sucursal.sucNombre : 'N/A';
  }

  // ========== MÉTODOS PARA SELECCIÓN Y COPIA ==========

  /** Si todas las filas están seleccionadas */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Seleccionar/deseleccionar todas las filas */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** Abrir diálogo para copiar combos */
  copiarCombosSeleccionados(): void {
    if (this.selection.selected.length === 0) {
      this.toastr.warning(
        'Selecciona al menos un combo para copiar',
        'Advertencia'
      );
      return;
    }

    const dialogRef = this.dialog.open(ComboCopyDialogComponent, {
      width: '500px',
      data: {
        combosSeleccionados: this.selection.selected.length,
        sucursales: this.listSucursales,
      },
    });

    dialogRef.afterClosed().subscribe((sucursalDestino: number) => {
      if (sucursalDestino) {
        this.ejecutarCopiaCombos(sucursalDestino);
      }
    });
  }

  /** Ejecutar la copia de combos */
  private ejecutarCopiaCombos(sucursalDestino: number): void {
    const comboIds = this.selection.selected.map((combo) => combo.comboId);

    this.comboService.copyComboToSucursal(comboIds, sucursalDestino).subscribe({
      next: (response) => {
        console.log('Respuesta de copia:', response);

        if (response.data.success) {
          const copiados = response.data.copiados || 0;
          const detalles = response.data.detalles || [];
          const totalSeleccionados = this.selection.selected.length;

          // Mostrar mensaje de éxito si hubo copias
          if (copiados > 0) {
            this.toastr.success(
              `Se copiaron ${copiados} de ${totalSeleccionados} combo(s) exitosamente`,
              'Operación exitosa',
              { timeOut: 4000 }
            );
          }

          // Mostrar detalles de combos que no se copiaron
          if (detalles.length > 0) {
            detalles.forEach((detalle: any) => {
              if (detalle.length > 0) {
                this.toastr.warning(detalle, 'Advertencia', {
                  timeOut: 6000,
                  closeButton: true,
                });
              }
            });
          }

          // Si no se copió ninguno
          if (copiados === 0) {
            this.toastr.info(
              'No se copió ningún combo. Revisa las advertencias.',
              'Información',
              { timeOut: 4000 }
            );
          }

          this.selection.clear();
          this.search();
        } else {
          this.toastr.error(
            response.errores?.join(', ') || 'No se pudo copiar ningún combo',
            'Error'
          );
        }
      },
      error: (err) => {
        console.error('Error al copiar combos:', err);
        this.toastr.error('Error al copiar los combos', err.error.errores[0]);
      },
    });
  }

  showProductos(event: MouseEvent, combo: any): void {

    this.cancelHide();

    this.currentProductos = combo.productos || [];

    const cellRect = (event.target as HTMLElement).getBoundingClientRect();
    const popupWidth = 500; // Ancho mínimo del popup
    const popupHeight = 300; // Altura estimada
    const padding = 10;

    let x = cellRect.left + cellRect.width / 2 - popupWidth / 2;
    let y = cellRect.bottom + padding;

    // Ajustar si se sale por la derecha
    if (x + popupWidth > window.innerWidth) {
      x = window.innerWidth - popupWidth - padding;
    }

    // Ajustar si se sale por la izquierda
    if (x < padding) {
      x = padding;
    }

    // Ajustar si se sale por abajo (mostrar arriba de la celda)
    if (y + popupHeight > window.innerHeight) {
      y = cellRect.top - popupHeight - padding;
    }

    // Si tampoco cabe arriba, mostrar al lado
    if (y < padding) {
      y = cellRect.top;
      x = cellRect.right + padding;

      // Si se sale por la derecha, mostrar a la izquierda
      if (x + popupWidth > window.innerWidth) {
        x = cellRect.left - popupWidth - padding;
      }
    }

    this.popupPosition = { x, y };

    // Mostrar el popup con un delay suave de 400ms
    this.showTimeout = setTimeout(() => {
      this.showPopup = true;
    }, 400);
  }

  /**
   * Oculta el popup (sin delay, se oculta inmediatamente)
   */
  hideProductos(): void {
    // Solo ocultar si el mouse no está sobre el popup
    this.hideTimeout = setTimeout(() => {
      this.showPopup = false;
      this.currentProductos = [];
    }, 100);
  }

  /**
   * Programa el ocultamiento del popup con un pequeño delay
   */
  scheduleHide(): void {
    // Cancelar el timeout de mostrar si aún no se ha mostrado
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    this.hideTimeout = setTimeout(() => {
      this.showPopup = false;
      this.currentProductos = [];
    }, 150);
  }

  /**
   * Cancela el ocultamiento programado del popup
   */
  cancelHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }
}
