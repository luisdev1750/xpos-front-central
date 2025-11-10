import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProductoSugeridoService } from '../producto-sugerido.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-producto-sugerido-edit',
  standalone: false,
  templateUrl: './producto-sugerido-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
    '.ranking-field .mat-mdc-form-field-infix { padding: 0 !important; }',
    '.ranking-field .mat-mdc-text-field-wrapper { padding: 0 8px !important; }',
  ],
  styleUrl: './producto-sugerido-edit.component.css',
})
export class ProductoSugeridoEditComponent implements OnInit {
  productoSugerido: any;
  isEditMode: boolean = false;

  displayedColumnsSugeridos = [
    'ranking',
    'productoNombreSugerido',
    'productoSkuSugerido',
    'listaPrecioNombreSugerido',
    'productoActivoSugerido',
    'actions',
  ];

  listSucursal: any[] = [];
  listProductosPrincipalesCompleta: any[] = [];
  listProductosPrincipales: any[] = [];
  listProductosSugeridosCompleta: any[] = [];
  listProductosSugeridos: any[] = [];

  productoPrincipalControl = new FormControl('');
  productoSugeridoControl = new FormControl('');

  filteredProductosPrincipales!: Observable<any[]>;
  filteredProductosSugeridos!: Observable<any[]>;

  productoPrincipalSeleccionado: any = null;
  productoSugeridoSeleccionado: any = null;
   sucursalFiltroPreseleccionada: number = 0;
  private isUpdatingProgrammatically = false;
  private nextTempId: number = -1;

  constructor(
    private dialogRef: MatDialogRef<ProductoSugeridoEditComponent>,
    private productoSugeridoService: ProductoSugeridoService,
    private toastr: ToastrService,
    private sucursalesService: SucursalService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data recuperada:', data.sucursalFilter);
    this.productoSugerido = { ...data.productoSugerido };
      this.sucursalFiltroPreseleccionada = data.sucursalFilter || 0;
    // Determinar si es edición o creación
    this.isEditMode = data.isEditMode;
    console.log('------------------------data-------------------------');

    console.log(data);

    // Asignar IDs temporales a productos sugeridos existentes
    if (
      this.productoSugerido.productosSugeridos &&
      this.productoSugerido.productosSugeridos.length > 0
    ) {
      this.productoSugerido.productosSugeridos =
        this.productoSugerido.productosSugeridos.map((p: any) => {
          if (!p._tempId) {
            return { ...p, _tempId: this.nextTempId-- };
          }
          return p;
        });
    } else {
      this.productoSugerido.productosSugeridos = [];
    }
  }

  ngOnInit() {
    this.loadSucursales();

    // Si estamos en modo edición, cargar datos
    if (this.isEditMode) {
      this.loadProductosPrincipales(this.productoSugerido.sucIdSel);
      this.loadDetalleProductoSugerido();
      this.loadProductosSugeridos(
        this.productoSugerido.sucIdSel,
        this.productoSugerido.proIdSel,
        this.productoSugerido.lprIdSel
      );
    }
  }

  onRankingChange() {
    // Reordenar la lista según los rankings ingresados
    this.productoSugerido.productosSugeridos.sort((a: any, b: any) => {
      const rankA = a.ranking || 999;
      const rankB = b.ranking || 999;
      return rankA - rankB;
    });

    console.log(
      'Rankings actualizados:',
      this.productoSugerido.productosSugeridos.map((p: any) => ({
        producto: p.productoNombreSugerido,
        ranking: p.ranking,
      }))
    );
  }

  deleteAllSugerencias() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: `¿Está seguro de eliminar TODAS las sugerencias del producto "${this.productoSugerido.proNombreSel}"? Esta acción no se puede deshacer.`,
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoSugeridoService
          .delete(
            this.productoSugerido.sucIdSel,
            this.productoSugerido.proIdSel,
            this.productoSugerido.lprIdSel
          )
          .subscribe({
            next: (result) => {
              if (result?.message) {
                this.toastr.success(
                  'Todas las sugerencias han sido eliminadas exitosamente',
                  'Transacción exitosa'
                );
                this.productoSugeridoService.setIsUpdated(true);
                this.dialogRef.close();
              } else {
                this.toastr.error('Ha ocurrido un error', 'Error');
              }
            },
            error: (err) => {
              console.error('Error al eliminar sugerencias:', err);
              this.toastr.error('Ha ocurrido un error al eliminar', 'Error');
            },
          });
      }
    });
  }

  loadSucursales() {
  this.sucursalesService.findAll().subscribe(
    (res) => {
      console.log('Sucursales cargadas:', res);
      this.listSucursal = res;

      if (!this.isEditMode && this.sucursalFiltroPreseleccionada > 0) {

        const sucursalExiste = this.listSucursal.some(
          (s) => s.sucId === this.sucursalFiltroPreseleccionada
        );

        if (sucursalExiste) {

          this.productoSugerido.sucIdSel = this.sucursalFiltroPreseleccionada;

          this.loadProductosPrincipales(this.sucursalFiltroPreseleccionada);
          
          console.log(
            `Sucursal ${this.sucursalFiltroPreseleccionada} preseleccionada desde el filtro`
          );
        }
      }
    },
    (error) => {
      console.log('Error al cargar sucursales:', error);
      this.toastr.error('Error al cargar sucursales', 'Error');
    }
  );
}

  onSucursalChange(event: any) {
    if (!this.canChangeSucursal()) {
      this.toastr.warning(
        'No puede cambiar la sucursal. Primero elimine todos los productos sugeridos.',
        'Advertencia'
      );
      event.source.value = this.productoSugerido.sucIdSel;
      return;
    }

    this.productoSugerido.sucIdSel = event.value;

    // 🔹 LIMPIAR PRODUCTO PRINCIPAL AL CAMBIAR SUCURSAL
    this.productoSugerido.proIdSel = 0;
    this.productoSugerido.lprIdSel = 0;
    this.productoSugerido.proNombreSel = '';
    this.productoPrincipalControl.reset();
    this.productoPrincipalSeleccionado = null;

    // 🔹 LIMPIAR PRODUCTOS SUGERIDOS
    this.listProductosSugeridosCompleta = [];
    this.listProductosSugeridos = [];
    this.productoSugeridoControl.reset();
    this.productoSugeridoSeleccionado = null;

    if (event.value) {
      this.loadProductosPrincipales(event.value);
    } else {
      this.listProductosPrincipalesCompleta = [];
      this.listProductosPrincipales = [];
    }
  }
  canChangeSucursal(): boolean {
    if (this.isEditMode) {
      return false;
    }
    return (
      !this.productoSugerido.productosSugeridos ||
      this.productoSugerido.productosSugeridos.length === 0
    );
  }

  loadProductosPrincipales(sucursalId: number) {
    if (!sucursalId || sucursalId <= 0) {
      this.toastr.warning(
        'Debe seleccionar una sucursal primero',
        'Advertencia'
      );
      return;
    }

    this.productoSugeridoService
      .findProductosDisponibles(sucursalId)
      .subscribe({
        next: (productos) => {
          console.log('Productos principales disponibles:', productos);

          if (productos && productos.length > 0) {
            this.listProductosPrincipalesCompleta = productos;
            this.listProductosPrincipales = [...productos];
            this.setupAutocompletePrincipal();
            this.toastr.success(
              `${productos.length} productos disponibles`,
              'Éxito'
            );
          } else {
            this.listProductosPrincipalesCompleta = [];
            this.listProductosPrincipales = [];
            this.toastr.info(
              'No hay productos disponibles sin sugerencias configuradas',
              'Información'
            );
          }
        },
        error: (error) => {
          console.error('Error cargando productos principales:', error);
          this.toastr.error('Error cargando productos', 'Error');
        },
      });
  }

  loadDetalleProductoSugerido() {
    this.productoSugeridoService
      .findDetalle(
        this.productoSugerido.sucIdSel,
        this.productoSugerido.proIdSel,
        this.productoSugerido.lprIdSel
      )
      .subscribe({
        next: (detalle) => {
          console.log('Detalle cargado:', detalle);

          this.productoSugerido.proNombreSel = detalle.proNombreSel;
          this.productoSugerido.proActivoSel = detalle.proActivoSel;

          if (detalle && detalle.productosSugeridos) {
          
            this.productoSugerido.productosSugeridos =
              detalle.productosSugeridos.map((sug: any, index: number) => ({
                sucIdSug: sug.sucIdSug,
                proIdSug: sug.proIdSug,
                lprIdSug: sug.lprIdSug,
                ranking: sug.ranking || index + 1,
                productoNombreSugerido: sug.proNombreSug,
                productoSkuSugerido: sug.proSkuSug,
                listaPrecioNombreSugerido: sug.lprNombreSug,
                productoActivoSugerido: sug.proActivoSug,
                _tempId: this.nextTempId--,
              }));

        
            this.productoSugerido.productosSugeridos.sort((a: any, b: any) => {
              const rankA = a.ranking || 999;
              const rankB = b.ranking || 999;
              return rankA - rankB;
            });
          }
        },
        error: (error) => {
          console.error('Error cargando detalle:', error);
          this.toastr.error('Error cargando detalle de sugerencias', 'Error');
        },
      });
  }

  loadProductosSugeridos(sucId: number, proId: number, lprId: number) {
    this.productoSugeridoService
      .findProductosSugeribles(sucId, proId, lprId)
      .subscribe({
        next: (productos) => {
          console.log('Productos sugeribles:', productos);

          if (productos && productos.length > 0) {
            this.listProductosSugeridosCompleta = productos;
            this.listProductosSugeridos = [...productos];
            this.setupAutocompleteSugeridos();
          } else {
            this.listProductosSugeridosCompleta = [];
            this.listProductosSugeridos = [];
          }
        },
        error: (error) => {
          console.error('Error cargando productos sugeribles:', error);
          this.toastr.error('Error cargando productos sugeribles', 'Error');
        },
      });
  }

  setupAutocompletePrincipal() {
    this.filteredProductosPrincipales =
      this.productoPrincipalControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterProductos(
            this._getFilterValue(value),
            this.listProductosPrincipales
          )
        )
      );
  }

  setupAutocompleteSugeridos() {
    this.filteredProductosSugeridos =
      this.productoSugeridoControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterProductos(
            this._getFilterValue(value),
            this.listProductosSugeridos
          )
        )
      );
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.proNombre)
      return value.proNombre;
    return '';
  }

  private _filterProductos(value: string, lista: any[]): any[] {
    const filterValue = value.toLowerCase();
    return lista.filter(
      (producto) =>
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proSku &&
          producto.proSku.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
    );
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoPrincipalSelected(producto: any) {
    if (this.isUpdatingProgrammatically || this.isEditMode) return;
    if (!producto || !producto.proId) return;

    this.productoPrincipalSeleccionado = producto;
    this.productoSugerido.proIdSel = producto.proId;
    this.productoSugerido.lprIdSel = producto.lprId;

    console.log('Producto principal seleccionado:', producto);

    // Cargar productos sugeribles
    this.loadProductosSugeridos(
      this.productoSugerido.sucIdSel,
      producto.proId,
      producto.lprId
    );
  }

  onProductoSugeridoSelected(producto: any) {
    if (this.isUpdatingProgrammatically) return;
    if (!producto || !producto.proId) return;

    this.productoSugeridoSeleccionado = producto;
    console.log('Producto sugerido seleccionado:', producto);
  }

  agregarProductoSugerido() {
    if (!this.productoSugeridoSeleccionado) {
      this.toastr.warning(
        'Debe seleccionar un producto sugerido',
        'Advertencia'
      );
      return;
    }


    const yaExiste = this.productoSugerido.productosSugeridos.some(
      (p: any) => p.proIdSug === this.productoSugeridoSeleccionado.proId
    );

    if (yaExiste) {
      this.toastr.warning(
        'Este producto ya está en la lista de sugerencias',
        'Producto Duplicado'
      );
      this.productoSugeridoControl.reset();
      this.productoSugeridoSeleccionado = null;
      return;
    }

    const nuevoSugerido = {
      sucIdSug: this.productoSugerido.sucIdSel,
      proIdSug: this.productoSugeridoSeleccionado.proId,
      lprIdSug: this.productoSugeridoSeleccionado.lprId,
      ranking: this.productoSugerido.productosSugeridos.length + 1,
      productoNombreSugerido: this.productoSugeridoSeleccionado.proNombre,
      productoSkuSugerido: this.productoSugeridoSeleccionado.proSku,
      listaPrecioNombreSugerido: this.productoSugeridoSeleccionado.lprNombre,
      productoActivoSugerido: this.productoSugeridoSeleccionado.proActivo, 
      _tempId: this.nextTempId--,
    };

    this.productoSugerido.productosSugeridos = [
      ...this.productoSugerido.productosSugeridos,
      nuevoSugerido,
    ];

    // Ordenar inmediatamente después de agregar
    this.onRankingChange();

    // Limpiar selección
    this.productoSugeridoControl.reset();
    this.productoSugeridoSeleccionado = null;

    this.toastr.success('Producto agregado a las sugerencias', 'Éxito');
  }

  onProductoPrincipalClear() {
    this.productoPrincipalControl.reset();
    this.productoPrincipalSeleccionado = null;
  }

  onProductoSugeridoClear() {
    this.productoSugeridoControl.reset();
    this.productoSugeridoSeleccionado = null;
  }

  deleteProductoSugerido(item: any) {
    console.log('Eliminando producto sugerido:', item);

    this.productoSugerido.productosSugeridos =
      this.productoSugerido.productosSugeridos.filter(
        (p: any) => p._tempId !== item._tempId
      );

    // Reajustar rankings
    this.productoSugerido.productosSugeridos =
      this.productoSugerido.productosSugeridos.map((p: any, index: number) => ({
        ...p,
        ranking: index + 1,
      }));
  }

  save() {
    // Validaciones
    if (
      !this.productoSugerido.sucIdSel ||
      !this.productoSugerido.proIdSel ||
      !this.productoSugerido.lprIdSel
    ) {
      this.toastr.error('Debe completar todos los campos requeridos', 'Error');
      return;
    }

    if (
      !this.productoSugerido.productosSugeridos ||
      this.productoSugerido.productosSugeridos.length === 0
    ) {
      this.toastr.error('Debe agregar al menos un producto sugerido', 'Error');
      return;
    }

    // Preparar DTO para enviar al backend
    const dtoToSave = {
      sucIdSel: this.productoSugerido.sucIdSel,
      proIdSel: this.productoSugerido.proIdSel,
      lprIdSel: this.productoSugerido.lprIdSel,
      productosSugeridos: this.productoSugerido.productosSugeridos.map(
        (p: any, index: number) => ({
          sucIdSug: p.sucIdSug,
          proIdSug: p.proIdSug,
          lprIdSug: p.lprIdSug,
          ranking: p.ranking,
        })
      ),
    };

    console.log('DTO a guardar:', dtoToSave);

    this.productoSugeridoService.save(dtoToSave, this.isEditMode).subscribe({
      next: (result) => {
        if (result?.message) {
          this.toastr.success(
            'Los productos sugeridos han sido guardados exitosamente',
            'Transacción exitosa'
          );
          this.productoSugeridoService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
