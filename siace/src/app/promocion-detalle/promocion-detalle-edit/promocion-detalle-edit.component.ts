import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { PromocionDetalleService } from '../promocion-detalle.service';
import { PromocionDetalle } from '../promocion-detalle';
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
  // ==========================================
  // PROPIEDADES
  // ==========================================
  
  // Propiedades básicas
  promocionDetalle!: PromocionDetalle;
  promocionId: string = '';
  sucursalId: string = '';
  tipoPromocionId: number = 0;
  tipoPromocionList: any[] = [];
  promocionCurrent: Promocion = new Promocion();

  // Producto obsequio
  prdPobProId: number = 0;
  productoObsequioSeleccionado: any = null;

  // Listas completas (backup inicial)
  listFamiliasCompleta: any[] = [];
  listProductosCompleta: any[] = [];
  listPresentacionesCompleta: any[] = [];

  // Listas filtradas para mostrar en los combos
  listFamilias: any[] = [];
  listProductos: any[] = [];
  listPresentaciones: any[] = [];

  // Controles de autocomplete
  productoControl = new FormControl('');
  productoObsequioControl = new FormControl('');

  // Observables filtrados
  filteredProductos!: Observable<any[]>;
  filteredProductosObsequio!: Observable<any[]>;

  // Flag para evitar loops infinitos
  private isUpdatingProgrammatically = false;

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  
  constructor(
    private dialogRef: MatDialogRef<PromocionDetalleEditComponent>,
    private promocionDetalleService: PromocionDetalleService,
    private toastr: ToastrService,
    private promocionService: TipoPromocionService,
    private promocionServiceController: PromocionService,
    private promocionObsequioService: PromocionObsequioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocionDetalle = data.promocionDetalle;
    this.promocionId = data.promocionId;
    this.promocionDetalle.prdPmoId = data.promocionId;
    this.tipoPromocionId = data.tipoPromocionId;
    this.sucursalId = data.sucursalId;
    this.prdPobProId = data.promocionDetalle?.prdPobProId || 0;
  }

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  
  ngOnInit() {
    this.loadCatalogosIniciales();
    this.loadInicialInfoCombobox();
  }

  // ==========================================
  // CARGA INICIAL DE DATOS
  // ==========================================
  
  loadInicialInfoCombobox() {
    // Cargar tipos de promoción
    this.promocionService.find({ tprId: '0', tprActivo: 'all' }).subscribe({
      next: (result) => {
        this.tipoPromocionList = result;
      },
      error: (error) => {
        this.toastr.error('Error al cargar tipos de promoción', 'Error');
      },
    });

    // Cargar promoción actual
    this.promocionServiceController
      .find({ pmoId: this.promocionId, pmoTpr: '0', pmoSucId : '0' })
      .subscribe({
        next: (res) => {
          if (res[0]) {
            this.promocionCurrent = res[0];
          }
        },
        error: (error) => {
          console.error('Error al cargar promoción:', error);
        },
      });
  }

  loadCatalogosIniciales() {
    this.promocionDetalleService.getCatalogosIniciales().subscribe({
      next: (data) => {
        console.log("Log from servicio");
        console.log(data);
                
        // Guardar copias completas
        this.listFamiliasCompleta = [...data.familias];
        this.listProductosCompleta = [...data.productos];
        this.listPresentacionesCompleta = [...data.presentaciones];

        // Inicializar listas visibles
        this.listFamilias = [...data.familias];
        this.listProductos = [...data.productos];
        this.listPresentaciones = [...data.presentaciones];
console.log("list productos completa");
console.log(this.listProductosCompleta);


        // Setup autocomplete
        this.setupAutocomplete();

        // Establecer valores iniciales
        this.setInitialValues();
      },
      error: (error) => {
        console.error('Error cargando catálogos:', error);
        this.toastr.error('Error cargando catálogos', 'Error');
      },
    });
  }

  // ==========================================
  // EVENTOS DE CAMBIO
  // ==========================================
  
  onPromocionIdChange(event: any) {
    this.promocionDetalle.prdPmoId = event.value;
  }

  onFamiliaChange(event: any) {
    if (this.isUpdatingProgrammatically) return;

    const familiaId = event.value;

    if (!familiaId || familiaId === 0) {
      this.promocionDetalle.prdFamId = 0;
      this.resetToInitialState();
      return;
    }

    this.promocionDetalle.prdFamId = familiaId;

    // Filtrar productos por familia (y presentación si existe)
    if (this.promocionDetalle.prdPreId && this.promocionDetalle.prdPreId > 0) {
      this.listProductos = this.listProductosCompleta.filter(
        (p) =>
          p.proFamId === familiaId &&
          p.proPreId === this.promocionDetalle.prdPreId
      );
    } else {
      this.listProductos = this.listProductosCompleta.filter(
        (p) => p.proFamId === familiaId
      );
    }

    // Obtener presentaciones únicas
    const presentacionIds = [
      ...new Set(this.listProductos.map((p) => p.proPreId)),
    ];
    this.listPresentaciones = this.listPresentacionesCompleta.filter((pr) =>
      presentacionIds.includes(pr.preId)
    );

    // Limpiar producto si no pertenece a esta familia
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

    // Limpiar presentación si no está disponible
    if (
      this.promocionDetalle.prdPreId &&
      !presentacionIds.includes(this.promocionDetalle.prdPreId)
    ) {
      this.promocionDetalle.prdPreId = 0;
    }

    this.refreshAutocomplete();
  }

  onPresentacionChange(event: any) {
    if (this.isUpdatingProgrammatically) return;

    const presentacionId = event.value;

    if (!presentacionId || presentacionId === 0) {
      this.promocionDetalle.prdPreId = 0;
      this.resetToInitialState();
      return;
    }

    this.promocionDetalle.prdPreId = presentacionId;

    // Filtrar productos por presentación (y familia si existe)
    if (this.promocionDetalle.prdFamId && this.promocionDetalle.prdFamId > 0) {
      this.listProductos = this.listProductosCompleta.filter(
        (p) =>
          p.proPreId === presentacionId &&
          p.proFamId === this.promocionDetalle.prdFamId
      );
    } else {
      this.listProductos = this.listProductosCompleta.filter(
        (p) => p.proPreId === presentacionId
      );
    }

    // Obtener familias únicas
    const familiaIds = [...new Set(this.listProductos.map((p) => p.proFamId))];
    this.listFamilias = this.listFamiliasCompleta.filter((f) =>
      familiaIds.includes(f.famId)
    );

    // Limpiar producto si no tiene esta presentación
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

    // Limpiar familia si no está disponible
    if (
      this.promocionDetalle.prdFamId &&
      !familiaIds.includes(this.promocionDetalle.prdFamId)
    ) {
      this.promocionDetalle.prdFamId = 0;
    }

    this.refreshAutocomplete();
  }

  onProductoSelected(producto: any) {
    if (this.isUpdatingProgrammatically) return;
    if (!producto || !producto.proId) return;

    this.isUpdatingProgrammatically = true;

    // Actualizar el modelo
    this.promocionDetalle.prdProId = producto.proId;
    this.promocionDetalle.prdFamId = producto.proFamId;
    this.promocionDetalle.prdPreId = producto.proPreId;

    // Ajustar las listas según el producto seleccionado
    this.listFamilias = this.listFamiliasCompleta.filter(
      (f) => f.famId === producto.proFamId
    );
    this.listPresentaciones = this.listPresentacionesCompleta.filter(
      (pr) => pr.preId === producto.proPreId
    );
    this.listProductos = this.listProductosCompleta.filter(
      (p) => p.proFamId === producto.proFamId
    );

    this.isUpdatingProgrammatically = false;
  }

  onProductoClear() {
    this.promocionDetalle.prdProId = 0;
    this.resetToInitialState();
  }

  onProductoObsequioSelected(producto: any) {
    this.productoObsequioSeleccionado = producto;
    this.promocionDetalle.prdPobProId = producto?.proId || 0;
    console.log("Producto seleccionado:");
    console.log(producto);
    this.productoObsequioSeleccionado.prdFamId = producto.proFamId;
    this.productoObsequioSeleccionado.prdPreId = producto.proPreId;
  }

  // ==========================================
  // UTILIDADES
  // ==========================================
  
  resetToInitialState() {
    this.listFamilias = [...this.listFamiliasCompleta];
    this.listProductos = [...this.listProductosCompleta];
    this.listPresentaciones = [...this.listPresentacionesCompleta];

    this.promocionDetalle.prdFamId = 0;
    this.promocionDetalle.prdPreId = 0;
    this.promocionDetalle.prdProId = 0;

    this.isUpdatingProgrammatically = true;
    this.productoControl.reset();
    this.isUpdatingProgrammatically = false;

    this.refreshAutocomplete();
  }

  refreshAutocomplete() {
    const currentValue = this.productoControl.value;
    this.productoControl.setValue('');
    setTimeout(() => {
      this.productoControl.setValue(currentValue || '');
    }, 0);
  }

  // ==========================================
  // AUTOCOMPLETE
  // ==========================================
  
  setupAutocomplete() {
    if (this.listProductosCompleta.length === 0) return;

    // Autocomplete para producto principal
    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProductos(this._getFilterValue(value)))
    );


    // Autocomplete para producto obsequio
    this.filteredProductosObsequio =
      this.productoObsequioControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterProductosObsequio(this._getFilterValue(value))
        )
      );
  }

  setInitialValues() {
    // Cargar producto principal si existe
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
        this.onProductoSelected(producto);
      }
    }

    // Cargar producto obsequio si existe
    if (this.prdPobProId > 0 && this.listProductosCompleta.length > 0) {
      const productoObsequio = this.listProductosCompleta.find(
        (p) => p.proId === this.prdPobProId
      );

      if (productoObsequio) {
        this.productoObsequioControl.setValue(productoObsequio);
        this.productoObsequioSeleccionado = productoObsequio;
        console.log("producto obsequio inicial");
        console.log(productoObsequio);
      }
    }
  }

  private _getFilterValue(value: any): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.proNombre)
      return value.proNombre;
    return '';
  }

  private _filterProductos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listProductos.filter(
      (producto) =>
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proSku &&
          producto.proSku.toLowerCase().includes(filterValue)) 
    );
  }

  private _filterProductosObsequio(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listProductosCompleta.filter(
      (producto) =>
        (producto.proNombre &&
          producto.proNombre.toLowerCase().includes(filterValue)) ||
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        producto.proId.toString().includes(filterValue)
    );
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  // ==========================================
  // GUARDAR
  // ==========================================
  
  save() {
    if (!this.promocionCurrent || !this.promocionDetalle) {
      this.toastr.error('Faltan datos necesarios para guardar', 'Error');
      return;
    }

    const tipoPromocion = this.promocionCurrent.pmoTprId;
    const esPromocionObsequio = tipoPromocion === 1;
    const esPromocionNxM = tipoPromocion === 2;
    const esPromocionDescuento = tipoPromocion === 3;

    // Extraer valores NxM del nombre de la promoción si es tipo NxM
    let cantidadCompra = null;
    let cantidadObsequio = null;
    
    if (esPromocionNxM) {
      const regexPromocion = /(\d+)\s*x\s*(\d+)/i;
      const match = this.promocionCurrent.pmoNombre.match(regexPromocion);
      
      if (!match) {
        this.toastr.error(
          'No se pudo extraer la información NxM del nombre de la promoción',
          'Error en formato'
        );
        return;
      }
      
      cantidadCompra = parseInt(match[1]);    // Primer número (N) - ej: 3 en "3x2"
      const cantidadPagada = parseInt(match[2]);  // Segundo número (M) - ej: 2 en "3x2"
      cantidadObsequio = cantidadCompra - cantidadPagada; // Calcular obsequio: 3-2=1
      
      console.log(`Promoción NxM detectada: ${cantidadCompra}x${cantidadPagada}`);
      console.log(`prdNxmProdCompra: ${cantidadCompra}, prdNxmProdObsequio: ${cantidadObsequio}`);
    }

    // Extraer porcentaje de descuento del nombre de la promoción si es tipo Descuento
    let porcentajeDescuento = null;
    
    if (esPromocionDescuento) {
      const regexDescuento = /(\d+)\s*%/i;
      const match = this.promocionCurrent.pmoNombre.match(regexDescuento);
      
      if (!match) {
        this.toastr.error(
          'No se pudo extraer el porcentaje de descuento del nombre de la promoción',
          'Error en formato'
        );
        return;
      }
      
      porcentajeDescuento = parseInt(match[1]); // ej: 70 en "Descuento 70%"
      
      console.log(`Promoción de descuento detectada: ${porcentajeDescuento}%`);
      console.log(`prdPorcentajeDescuento: ${porcentajeDescuento}`);
    }

    console.log("producto de promoción detalle");
    console.log(this.promocionDetalle); 
    console.log("producto obsequio seleccionado en lista");
    console.log(this.productoObsequioSeleccionado);
  
    const productoRequest: PromocionDetalle = {
      prdId: this.promocionDetalle.prdId || 0,
      prdPmoId: this.promocionCurrent.pmoId,
      prdProId: this.promocionDetalle.prdProId != 0 ? this.promocionDetalle.prdProId: null ,
      prdFamId: this.promocionDetalle.prdFamId != 0 ?this.promocionDetalle.prdFamId : null,
      prdPreId: this.promocionDetalle.prdPreId != 0 ? this.promocionDetalle.prdPreId : null ,
      prdNxmProdCompra: esPromocionNxM ? cantidadCompra : null,
      prdNxmProdObsequio: esPromocionNxM ? cantidadObsequio : null,
      prdPorcentajeDescuento: esPromocionDescuento ? porcentajeDescuento : null,
      prdPmoSucId: this.promocionCurrent.pmoSucId,
      prdPobId: null,
      prdPobProId: this.productoObsequioSeleccionado?.proId ?? null,
    };

    this.promocionDetalleService.save(productoRequest).subscribe({
      next: (result) => {
        if (this.isValidResult(result)) {
          this.toastr.success(
            'El detalle de promoción ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionDetalleService.setIsUpdated(true);

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
      pobId: this.promocionDetalle.prdPobId || 0,
      pobPmoId: Number(this.promocionId),
      pobFamId: this.productoObsequioSeleccionado.prdFamId ?? 0,
      pobPreId:  this.productoObsequioSeleccionado.prdPreId ?? 0,
      pobProId: this.productoObsequioSeleccionado.proId ?? 0,
      pobPmoSucId: Number(this.promocionCurrent.pmoSucId),
    };

    this.promocionObsequioService.save(promocionObsequio).subscribe({
      next: (result) => {
        if (this.isValidObsequioResult(result)) {
          this.toastr.success(
            'El producto obsequio ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionObsequioService.setIsUpdated(true);
          window.location.reload();
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

  // ==========================================
  // VALIDACIONES
  // ==========================================
  
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