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

  // Lista de productos para autocomplete
  listProductos: any[] = [];
  listFamilias: any[] = [];
  listPresentaciones: any[] = [];
  // Controles para autocomplete de productos
  productoControl = new FormControl('');
  productoObsequioControl = new FormControl('');

  // Observables filtrados para productos
  filteredProductos!: Observable<any[]>;
  filteredProductosObsequio!: Observable<any[]>;

  // Selecciones actuales para comboboxes
  selectedFamilia: number | null = null;
  selectedPresentacion: number | null = null;
  /* Constructores */

  constructor(
    private dialogRef: MatDialogRef<PromocionDetalleEditComponent>,
    private promocionDetalleService: PromocionDetalleService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private familiaService: FamiliaService,
    private presentacionService: PresentacionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.promocionDetalle = data.promocionDetalle;
  }

  ngOnInit() {
    this.loadCatalogs();
    this.loadProductos();
    this.loadCatalogosIniciales();
  }

  loadProductos() {
    // Cargar productos
    this.productoService
      .find({
        proId: '0',
        proFamId: '0',
        proPreId: '0',
        proActivo: 'all',
      })
      .subscribe((res) => {
        //   this.listProductos = res;
        console.log('Lista de productos final');
        console.log(this.listProductos);

        this.setupAutocomplete();
        this.setInitialValues();
      });
  }

  loadCatalogs() {
    this.familiaService
      .find({
        famId: '0',
        famSmaId: '0',
        famIdParent: '',
      })
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // ===============================================
  // EVENTOS DE COMBOBOXES INTERCONECTADOS
  // ===============================================
  onFamiliaChange(event: any) {
    console.log('Familia Id: ', event);

    //  this.selectedFamilia = familiaId;
    this.promocionDetalle.prdFamId = event.value;

    // Limpiar selecciones dependientes
    //  this.selectedPresentacion = null;
    //  this.promocionDetalle.prdPreId = null;
    this.promocionDetalle.prdPreId = 0;

    // Cargar productos y presentaciones de esta familia
    this.promocionDetalleService
      .getCatalogos(this.promocionDetalle.prdFamId, undefined, undefined)
      .subscribe({
        next: (data) => {
          this.listPresentaciones = data.presentaciones;
          // Aquí podrías filtrar los productos del autocomplete si quisieras
          console.log(
            'Familia seleccionada, presentaciones disponibles:',
            data.presentaciones
          );
          this.listPresentaciones = data.presentaciones; 
        },
        error: (error) => {
          console.error('Error al cargar datos por familia:', error);
        },
      });
  }

  onPresentacionChange(event: any){
    this.promocionDetalle.prdPreId =  event.value; 
    this.promocionDetalle.prdFamId= 0;



  }
  loadCatalogosIniciales() {
    console.log('Catalogos iniciales');

    this.promocionDetalleService.getCatalogosIniciales().subscribe({
      next: (data) => {
        console.log('Catalogos de catalogos iniciales:');
        console.log(data);

        this.listFamilias = data.familias;
        this.listProductos = data.productos;
        this.listPresentaciones = data.presentaciones;     
        console.log('Catálogos iniciales cargados:', data);
      
        this.setInitialCatalogValues();
      },
      error: (error) => {
        console.error('Error cargando catálogos:', error);
        this.toastr.error('Error cargando catálogos', 'Error');
      },
    });
  }

  setInitialCatalogValues() {
    // Si ya hay un producto seleccionado, cargar su familia y presentación
    if (this.promocionDetalle.prdProId) {
      this.promocionDetalleService
        .getCatalogos(undefined, this.promocionDetalle.prdProId, undefined)
        .subscribe((data) => {
          if (data.familias.length > 0) {
            this.selectedFamilia = data.familias[0].FamId;
            this.promocionDetalle.prdFamId = this.selectedFamilia ?? 0;
          }
          if (data.presentaciones.length > 0) {
            this.selectedPresentacion = data.presentaciones[0].PreId;
            this.promocionDetalle.prdPreId = this.selectedPresentacion ?? 0;
          }
        });
    }
  }
  setupAutocomplete() {
    if (this.listProductos.length > 0) {
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
            return this._filterProductos(filterValue);
          })
        );
    }
  }

  setInitialValues() {
    // Establecer valor inicial para producto principal
    if (this.promocionDetalle.prdProId && this.listProductos.length > 0) {
      const producto = this.listProductos.find(
        (p) => p.proId == this.promocionDetalle.prdProId
      );
      if (producto) {
        this.productoControl.setValue(producto);
      }
    }

    // Establecer valor inicial para producto obsequio si existe
    // if (this.promocionDetalle.prdProObsequioId && this.listProductos.length > 0) {
    //    const productoObsequio = this.listProductos.find(
    //       (p) => p.proId == this.promocionDetalle.prdProObsequioId
    //    );
    //    if (productoObsequio) {
    //       this.productoObsequioControl.setValue(productoObsequio);
    //    }
    // }
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

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoSelected(producto: any) {
    console.log('Producto principal seleccionado');
    console.log(producto);

    if (producto) {
      this.promocionDetalle.prdProId = producto.proId;
      this.promocionDetalle.prdFamId = producto.proFamId;
      this.promocionDetalle.prdPreId = producto.proPreId;
    }
  }

  onProductoObsequioSelected(producto: any) {
    console.log('Producto obsequio seleccionado');
    console.log(producto);

    // if (producto) {
    //    this.promocionDetalle.prdProObsequioId = producto.proId;
    //    this.promocionDetalle.prdFamObsequioId = producto.proFamId;
    //    this.promocionDetalle.prdPreObsequioId = producto.proPreId;
    // }
  }

  /*Métodos*/

  save() {
    this.promocionDetalleService.save(this.promocionDetalle).subscribe({
      next: (result) => {
        if (Number(result) > 0) {
          this.toastr.success(
            'El detalle de promoción ha sido guardado exitosamente',
            'Transacción exitosa'
          );
          this.promocionDetalleService.setIsUpdated(true);
          this.dialogRef.close();
        } else this.toastr.error('Ha ocurrido un error', 'Error');
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}
