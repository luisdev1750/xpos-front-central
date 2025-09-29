import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PromocionDetalleService } from '../promocion-detalle.service';
import { PromocionDetalle } from '../promocion-detalle';
import { ProductoService } from '../../producto/producto.service';
import { FamiliaService } from '../../familia/familia.service';
import { PresentacionService } from '../../presentacion/presentacion.service';
import { PromocionService } from '../../promocion/promocion.service';
import { TipoPromocionService } from '../../tipo-promocion/tipo-promocion.service';
import { Promocion } from '../../promocion/promocion';
import { PromocionObsequioService } from '../../promocion-obsequio/promocion-obsequio.service';

@Component({
  selector: 'app-promocion-detalle-edit',
  standalone: false,
  templateUrl: './promocion-detalle-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
  ],
})
export class PromocionDetalleEditComponent implements OnInit {
  id!: string;
  promocionDetalle!: PromocionDetalle;

  promocionId: string = '';
  sucursalId: string = '';
  tipoPromocionId;
  tipoPromocionList: any[] = [];
  promocionCurrent: Promocion = new Promocion();

  productoObsequioSeleccionado: any = [];
  // Listas completas (backup inicial)
  listFamiliasCompleta: any[] = [];
  listProductosCompleta: any[] = [];
  listPresentacionesCompleta: any[] = [];

  // Listas filtradas para mostrar en los combos
  listFamilias: any[] = [];
  listProductos: any[] = [];
  listPresentaciones: any[] = [];

  // Controles
  productoControl = new FormControl('');
  productoObsequioControl = new FormControl('');

  // Observables filtrados
  filteredProductos!: Observable<any[]>;
  filteredProductosObsequio!: Observable<any[]>;

  // Flag para evitar loops infinitos
  private isUpdatingProgrammatically = false;

  constructor(
    private dialogRef: MatDialogRef<PromocionDetalleEditComponent>,
    private promocionDetalleService: PromocionDetalleService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private familiaService: FamiliaService,
    private presentacionService: PresentacionService,
    private promocionService: TipoPromocionService,
    private promocionServiceController: PromocionService,
    private promocionObsequioService: PromocionObsequioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocionDetalle = data.promocionDetalle;
    this.promocionId = data.promocionId;
    this.promocionDetalle.prdPmoId = data.promocionId;
    this.tipoPromocionId = data.tipoPromocionId;
    this.tipoPromocionId = data.tipoPromocionId;
    this.sucursalId = data.sucursalId;
  }

  ngOnInit() {
    this.loadCatalogosIniciales();
    this.loadInicialInfoCombobox();
  }

  loadInicialInfoCombobox() {
    this.promocionService
      .find({
        tprId: '0',
        tprActivo: 'all',
      })
      .subscribe(
        (result) => {
          console.log('Tipo de promociones listaa: ');
          this.tipoPromocionList = result;

          console.log(result);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );

    this.promocionServiceController
      .find({
        pmoId: this.promocionId,
      })
      .subscribe(
        (res) => {
          console.log('Promocion actual seleccionada:');
          console.log(res);
          if (res[0]) {
            this.promocionCurrent = res[0];
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onPromocionIdChange(event: any) {
    this.promocionDetalle.prdPmoId = event.value;
  }

  // ===============================================
  // CARGA INICIAL
  // ===============================================
  loadCatalogosIniciales() {
    console.log('Cargando catálogos iniciales...');

    this.promocionDetalleService.getCatalogosIniciales().subscribe({
      next: (data) => {
        console.log('Catálogos recibidos:', data);

        // Guardar copias completas
        this.listFamiliasCompleta = [...data.familias];
        this.listProductosCompleta = [...data.productos];
        this.listPresentacionesCompleta = [...data.presentaciones];

        // Inicializar listas visibles
        this.listFamilias = [...data.familias];
        this.listProductos = [...data.productos];
        this.listPresentaciones = [...data.presentaciones];

        // Setup autocomplete
        this.setupAutocomplete();

        // Establecer valores iniciales si existen
        this.setInitialValues();
      },
      error: (error) => {
        console.error('Error cargando catálogos:', error);
        this.toastr.error('Error cargando catálogos', 'Error');
      },
    });
  }

  // ===============================================
  // EVENTOS DE FAMILIA
  // ===============================================
  onFamiliaChange(event: any) {
    if (this.isUpdatingProgrammatically) return;

    const familiaId = event.value;
    console.log('Familia seleccionada:', familiaId);

    if (!familiaId || familiaId === 0) {
      // Si se deselecciona familia, restaurar según presentación
      this.promocionDetalle.prdFamId = 0;
      this.resetToInitialState();
      return;
      if (
        this.promocionDetalle.prdPreId &&
        this.promocionDetalle.prdPreId > 0
      ) {
        this.onPresentacionChange({ value: this.promocionDetalle.prdPreId });
      } else {
        this.resetToInitialState();
      }
      return;
    }

    this.promocionDetalle.prdFamId = familiaId;

    // CASO: Si también hay presentación seleccionada, filtrar por AMBOS
    if (this.promocionDetalle.prdPreId && this.promocionDetalle.prdPreId > 0) {
      console.log('⚡ Filtrando por FAMILIA + PRESENTACIÓN');
      this.listProductos = this.listProductosCompleta.filter(
        (p) =>
          p.proFamId === familiaId &&
          p.proPreId === this.promocionDetalle.prdPreId
      );
    } else {
      // CASO: Solo familia
      console.log('📦 Filtrando solo por FAMILIA');
      this.listProductos = this.listProductosCompleta.filter(
        (p) => p.proFamId === familiaId
      );
    }

    // Obtener presentaciones únicas de los productos de esta familia
    const presentacionIds = [
      ...new Set(this.listProductos.map((p) => p.proPreId)),
    ];
    this.listPresentaciones = this.listPresentacionesCompleta.filter((pr) =>
      presentacionIds.includes(pr.preId)
    );

    // Si el producto actual no pertenece a esta familia, limpiarlo
    if (
      this.promocionDetalle.prdProId &&
      !this.listProductos.some(
        (p) => p.proId === this.promocionDetalle.prdProId
      )
    ) {
      this.isUpdatingProgrammatically = true;
      this.productoControl.reset();
      this.promocionDetalle.prdProId = 0;
      this.isUpdatingProgrammatically = false;
    }

    // Si la presentación actual no está en las disponibles, limpiarla
    if (
      this.promocionDetalle.prdPreId &&
      !presentacionIds.includes(this.promocionDetalle.prdPreId)
    ) {
      this.promocionDetalle.prdPreId = 0;
    }

    // CRÍTICO: Forzar actualización del autocomplete
    this.refreshAutocomplete();

    console.log('Productos filtrados:', this.listProductos.length);
    console.log('Presentaciones disponibles:', this.listPresentaciones.length);
  }

  // ===============================================
  // EVENTOS DE PRESENTACIÓN
  // ===============================================
  onPresentacionChange(event: any) {
    if (this.isUpdatingProgrammatically) return;

    const presentacionId = event.value;
    console.log('Presentación seleccionada:', presentacionId);

    if (!presentacionId || presentacionId === 0) {
      // Si se deselecciona presentación, restaurar según familia

      this.resetToInitialState();
      return;

      this.promocionDetalle.prdPreId = 0;
      if (
        this.promocionDetalle.prdFamId &&
        this.promocionDetalle.prdFamId > 0
      ) {
        this.onFamiliaChange({ value: this.promocionDetalle.prdFamId });
      } else {
        this.resetToInitialState();
      }
      return;
    }

    this.promocionDetalle.prdPreId = presentacionId;

    // CASO: Si también hay familia seleccionada, filtrar por AMBOS
    if (this.promocionDetalle.prdFamId && this.promocionDetalle.prdFamId > 0) {
      console.log('⚡ Filtrando por PRESENTACIÓN + FAMILIA');
      this.listProductos = this.listProductosCompleta.filter(
        (p) =>
          p.proPreId === presentacionId &&
          p.proFamId === this.promocionDetalle.prdFamId
      );
    } else {
      // CASO: Solo presentación
      console.log('📦 Filtrando solo por PRESENTACIÓN');
      this.listProductos = this.listProductosCompleta.filter(
        (p) => p.proPreId === presentacionId
      );
    }

    // Obtener familias únicas de los productos con esta presentación
    const familiaIds = [...new Set(this.listProductos.map((p) => p.proFamId))];
    this.listFamilias = this.listFamiliasCompleta.filter((f) =>
      familiaIds.includes(f.famId)
    );

    // Si el producto actual no tiene esta presentación, limpiarlo
    if (
      this.promocionDetalle.prdProId &&
      !this.listProductos.some(
        (p) => p.proId === this.promocionDetalle.prdProId
      )
    ) {
      this.isUpdatingProgrammatically = true;
      this.productoControl.reset();
      this.promocionDetalle.prdProId = 0;
      this.isUpdatingProgrammatically = false;
    }

    // Si la familia actual no está en las disponibles, limpiarla
    if (
      this.promocionDetalle.prdFamId &&
      !familiaIds.includes(this.promocionDetalle.prdFamId)
    ) {
      this.promocionDetalle.prdFamId = 0;
    }

    // CRÍTICO: Forzar actualización del autocomplete
    this.refreshAutocomplete();

    console.log('Productos filtrados:', this.listProductos.length);
    console.log('Familias disponibles:', this.listFamilias.length);
  }

  // ===============================================
  // EVENTOS DE PRODUCTO (AUTOCOMPLETE)
  // ===============================================
  onProductoSelected(producto: any) {
    if (this.isUpdatingProgrammatically) return;

    console.log('Producto seleccionado:', producto);

    if (!producto || !producto.proId) {
      return;
    }

    this.isUpdatingProgrammatically = true;

    // Actualizar el modelo
    this.promocionDetalle.prdProId = producto.proId;
    this.promocionDetalle.prdFamId = producto.proFamId;
    this.promocionDetalle.prdPreId = producto.proPreId;

    // Ajustar las listas según el producto seleccionado
    // La familia debe mostrar solo la del producto
    this.listFamilias = this.listFamiliasCompleta.filter(
      (f) => f.famId === producto.proFamId
    );

    // La presentación debe mostrar solo la del producto
    this.listPresentaciones = this.listPresentacionesCompleta.filter(
      (pr) => pr.preId === producto.proPreId
    );

    // Los productos se filtran por la familia del producto seleccionado
    this.listProductos = this.listProductosCompleta.filter(
      (p) => p.proFamId === producto.proFamId
    );

    this.isUpdatingProgrammatically = false;

    console.log('Familia auto-seleccionada:', producto.proFamId);
    console.log('Presentación auto-seleccionada:', producto.proPreId);
  }

  // ===============================================
  // EVENTO CUANDO SE LIMPIA EL AUTOCOMPLETE
  // ===============================================
  onProductoClear() {
    console.log('Producto limpiado');

    // Si hay familia o presentación seleccionada, mantener su contexto

    this.resetToInitialState();

    // if (this.promocionDetalle.prdFamId && this.promocionDetalle.prdFamId > 0) {
    //   this.onFamiliaChange({ value: this.promocionDetalle.prdFamId });
    // } else if (this.promocionDetalle.prdPreId && this.promocionDetalle.prdPreId > 0) {
    //   this.onPresentacionChange({ value: this.promocionDetalle.prdPreId });
    // } else {
    //   // Si no hay nada seleccionado, restaurar todo
    //   this.resetToInitialState();
    // }

    this.promocionDetalle.prdProId = 0;
  }

  // ===============================================
  // RESET A ESTADO INICIAL
  // ===============================================
  resetToInitialState() {
    console.log('Restaurando a estado inicial');

    this.listFamilias = [...this.listFamiliasCompleta];
    this.listProductos = [...this.listProductosCompleta];
    this.listPresentaciones = [...this.listPresentacionesCompleta];

    this.promocionDetalle.prdFamId = 0;
    this.promocionDetalle.prdPreId = 0;
    this.promocionDetalle.prdProId = 0;

    this.isUpdatingProgrammatically = true;
    this.productoControl.reset();
    this.isUpdatingProgrammatically = false;

    // CRÍTICO: Actualizar autocomplete
    this.refreshAutocomplete();
  }

  // ===============================================
  // REFRESCAR AUTOCOMPLETE (NUEVO MÉTODO)
  // ===============================================
  refreshAutocomplete() {
    // Forzar re-emisión del valor actual para actualizar el filtrado
    const currentValue = this.productoControl.value;
    this.productoControl.setValue('');
    setTimeout(() => {
      this.productoControl.setValue(currentValue || '');
    }, 0);
  }

  // ===============================================
  // AUTOCOMPLETE SETUP
  // ===============================================
  setupAutocomplete() {
    if (this.listProductosCompleta.length > 0) {
      // Autocomplete para producto principal
      this.filteredProductos = this.productoControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const filterValue = this._getFilterValue(value);
          return this._filterProductos(filterValue);
        })
      );

      // Autocomplete para producto obsequio
      this.filteredProductosObsequio =
        this.productoObsequioControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            const filterValue = this._getFilterValue(value);
            return this._filterProductosObsequio(filterValue);
          })
        );
    }
  }

  setInitialValues() {
    // Si hay producto seleccionado al abrir el diálogo
    if (
      this.promocionDetalle.prdProId &&
      this.listProductosCompleta.length > 0
    ) {
      const producto = this.listProductosCompleta.find(
        (p) => p.proId === this.promocionDetalle.prdProId
      );

      if (producto) {
        this.isUpdatingProgrammatically = true;
        this.productoControl.setValue(producto);
        this.isUpdatingProgrammatically = false;

        // Simular selección de producto para ajustar listas
        this.onProductoSelected(producto);
      }
    }
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && value.proNombre) {
      return value.proNombre;
    }
    return '';
  }

  private _filterProductos(value: string): any[] {
    const filterValue = value.toLowerCase();
    // Filtrar sobre la lista ACTUAL (ya filtrada por familia/presentación)
    return this.listProductos.filter((producto) => {
      return (
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
      );
    });
  }

  private _filterProductosObsequio(value: string): any[] {
    const filterValue = value.toLowerCase();
    // Para obsequios, usar la lista completa
    return this.listProductosCompleta.filter((producto) => {
      return (
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
      );
    });
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoObsequioSelected(producto: any) {
    console.log('Producto obsequio seleccionado:', producto);

    // Implementar lógica para producto obsequio si es necesario

    this.productoObsequioSeleccionado = producto;
  }

  // ===============================================
  // GUARDAR
  // ===============================================
  save() {
    // Validar que tengamos los datos necesarios
    if (!this.promocionCurrent || !this.promocionDetalle) {
      this.toastr.error('Faltan datos necesarios para guardar', 'Error');
      return;
    }

    // Determinar el tipo de promoción
    const tipoPromocion = this.promocionCurrent.pmoTprId;
    const esPromocionObsequio = tipoPromocion === 1;
    const esPromocionNxM = tipoPromocion === 2;
    const esPromocionDescuento = tipoPromocion === 3;

    // Construir el objeto de promoción detalle
    const productoRequest: PromocionDetalle = {
      prdId: this.promocionDetalle.prdId || 0,
      prdPmoId: this.promocionCurrent.pmoId,
      prdProId: this.promocionDetalle.prdProId,
      prdFamId: this.promocionDetalle.prdFamId,
      prdPreId: this.promocionDetalle.prdPreId,
      prdNxmProdCompra: esPromocionNxM
        ? this.promocionDetalle.prdNxmProdCompra
        : null,
      prdNxmProdObsequio: esPromocionNxM
        ? this.promocionDetalle.prdNxmProdObsequio
        : null,
      prdPorcentajeDescuento: esPromocionDescuento
        ? this.promocionDetalle.prdPorcentajeDescuento
        : null,
      prdPmoSucId: this.promocionCurrent.pmoSucId,
    };

    console.log('Guardando promoción detalle:', productoRequest);

    // Guardar el detalle de promoción
    this.promocionDetalleService.save(productoRequest).subscribe({
      next: (result) => {
        if (this.isValidResult(result)) {
          this.toastr.success(
            'El detalle de promoción ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionDetalleService.setIsUpdated(true);

          // Si es promoción de obsequio, guardar también el producto obsequio
          if (esPromocionObsequio && this.productoObsequioSeleccionado) {
            this.guardarPromocionObsequio();
          } else {
            this.dialogRef.close();
          }
        } else {
          this.toastr.error('Ha ocurrido un error al guardar', 'Error');
        }
      },
      error: (err) => {
        console.error('Error guardando promoción detalle:', err);
        this.toastr.error('Ha ocurrido un error al guardar', 'Error');
      },
    });
  }

  private guardarPromocionObsequio() {
    if (!this.productoObsequioSeleccionado) {
      this.toastr.warning(
        'Debe seleccionar un producto obsequio',
        'Advertencia'
      );
      this.dialogRef.close();
      return;
    }

    const promocionObsequio = {
      pobId: 0,
      pobPmoId: Number(this.promocionId),
      pobFamId: this.promocionDetalle.prdFamId,
      pobPreId: this.promocionDetalle.prdPreId,
      pobProId: this.productoObsequioSeleccionado.proId,
      pobPmoSucId: Number(this.promocionCurrent.pmoSucId),
    };

    console.log('Guardando promoción obsequio:', promocionObsequio);

    this.promocionObsequioService.save(promocionObsequio).subscribe({
      next: (result) => {
        if (this.isValidObsequioResult(result)) {
          this.toastr.success(
            'El producto obsequio ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionObsequioService.setIsUpdated(true);
          this.dialogRef.close();
        } else {
          this.toastr.error(
            'Ha ocurrido un error al guardar el obsequio',
            'Error'
          );
          this.dialogRef.close();
        }
      },
      error: (err) => {
        console.error('Error guardando promoción obsequio:', err);
        this.toastr.error(
          'Ha ocurrido un error al guardar el obsequio',
          'Error'
        );
        this.dialogRef.close();
      },
    });
  }

  private isValidResult(result: any): boolean {
    return (
      result?.prdFamId != null &&
      result?.prdFamId !== undefined &&
      result?.prdFamId > 0
    );
  }

  private isValidObsequioResult(result: any): boolean {
    return (
      result?.pobPmoId != null &&
      result?.pobPmoId !== undefined &&
      result?.pobPmoId > 0
    );
  }
}
