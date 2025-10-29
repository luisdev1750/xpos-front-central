import { Component, Inject, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProductoImagenService } from '../producto-imagen.service';
import { NgForm } from '@angular/forms';

interface ImagenItem {
  tipoId: number;
  tipoNombre: string;
  archivo?: File;
  preview: string;
  isNew: boolean;
  nombreArchivo?: string;
  _tempId: number; // ID temporal único para identificar cada fila
}

@Component({
  selector: 'app-producto-imagen-edit',
  standalone: false,
  templateUrl: './producto-imagen-edit.component.html',
  styles: [
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }',
    '.mat-mdc-form-field {width: 100%;}',
    '.file-input-wrapper { margin: 15px 0; }',
    'mat-chip { margin: 2px !important; }'
  ]
})
export class ProductoImagenEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm!: NgForm;
  productoImagen: any;
  isEditMode: boolean = false;
  displayedColumnsImagenes = ['preview', 'tipoNombre', 'nombreArchivo', 'estado', 'actions'];
  
  // Listas de tipos de imagen
  listTipoImagenesCompleta: any[] = [];
  tiposDisponibles: any[] = [];
  
  // Lista de imágenes agregadas
  listaImagenes: ImagenItem[] = [];
  
  // Formulario temporal para agregar imagen
  tipoImagenSeleccionado: number | null = null;
  archivoTemporal: File | null = null;
  previewTemporal: string | null = null;
  
  // Productos para autocomplete
  listProductosCompleta: any[] = [];
  listProductos: any[] = [];
  productoControl = new FormControl('');
  filteredProductos!: Observable<any[]>;
  productoSeleccionado: any = null;
  
  private subs!: Subscription;
  private nextTempId: number = -1; // Contador para IDs temporales únicos

  constructor(
    private dialogRef: MatDialogRef<ProductoImagenEditComponent>,
    private productoImagenService: ProductoImagenService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subs = this.productoImagenService.getIsUpdated().subscribe(() => {
      this.loadProductos();
    });
    
    this.productoImagen = { ...data.productoImagen };
    this.isEditMode = this.productoImagen.proId > 0;
    
    console.log('📦 Data recibida en constructor:', this.productoImagen);
    
    // Si estamos editando, cargar las imágenes existentes
    // CORRECCIÓN: Verificar tanto "imagenes" (minúscula) como "Imagenes" (mayúscula)
    const imagenesData = this.productoImagen.imagenes || this.productoImagen.Imagenes;
    
    if (this.isEditMode && imagenesData && imagenesData.length > 0) {
      console.log('🖼️ Cargando imágenes existentes:', imagenesData);
      
      // IMPORTANTE: Cargar imágenes como Blob para pasar token de autorización
      imagenesData.forEach((img: any) => {
        const tipoId = img.timId || img.TimId;
        const tipoNombre = img.timNombre || img.TimNombre;
        const nombreArchivo = img.priNombre || img.PriNombre;
        
        // Agregar placeholder mientras carga
        const tempId = this.nextTempId--;
        this.listaImagenes.push({
          tipoId: tipoId,
          tipoNombre: tipoNombre,
          nombreArchivo: nombreArchivo,
          preview: 'assets/loading.gif', // Placeholder (opcional)
          isNew: false,
          _tempId: tempId
        });
        
        // Cargar imagen real con token
        this.productoImagenService.getImagenAsDataUrl(
          this.productoImagen.proId,
          nombreArchivo
        ).subscribe({
          next: (dataUrl: string) => {
            // Actualizar preview con la imagen real
            const imagenEnLista = this.listaImagenes.find(i => i._tempId === tempId);
            if (imagenEnLista) {
              imagenEnLista.preview = dataUrl;
            }
          },
          error: (err) => {
            console.error(`❌ Error cargando imagen ${nombreArchivo}:`, err);
            // Mantener placeholder o usar imagen de error
            const imagenEnLista = this.listaImagenes.find(i => i._tempId === tempId);
            if (imagenEnLista) {
              imagenEnLista.preview = 'assets/image-error.png'; // Opcional
            }
          }
        });
      });
      
      console.log('✅ Lista de imágenes procesada:', this.listaImagenes);
      
      // Actualizar tipos disponibles después de cargar imágenes existentes
      this.actualizarTiposDisponibles();
    } else {
      console.log('ℹ️ No hay imágenes existentes o modo creación');
    }
  }

  ngOnInit() {
    this.loadCatalogs();
    this.loadProductos();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    
    // IMPORTANTE: Liberar URLs de Blob para evitar memory leaks
    this.listaImagenes.forEach(img => {
      if (img.preview && img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
  }

  loadCatalogs() {
    this.productoImagenService.findTipoImagenes().subscribe({
      next: result => {
        console.log('📋 Tipos de imagen cargados:', result);
        this.listTipoImagenesCompleta = result;
        this.actualizarTiposDisponibles();
      },
      error: err => {
        console.error('❌ Error al cargar tipos de imágenes:', err);
        this.toastr.error('Error al cargar tipos de imágenes', 'Error');
      }
    });
  }

  loadProductos() {
    this.productoImagenService.findAllProductosImagenes().subscribe({
      next: (productos) => {
        this.listProductosCompleta = productos;
        this.listProductos = [...productos];
        this.setupAutocomplete();
        
        // Si estamos editando y hay producto, setear el seleccionado
        if (this.productoImagen.proId && this.listProductosCompleta.length > 0) {
          const productoEncontrado = this.listProductosCompleta.find(
            (p) => p.proId === this.productoImagen.proId
          );
          if (productoEncontrado) {
            this.productoSeleccionado = productoEncontrado;
            this.productoControl.setValue(productoEncontrado);
          }
        }
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.toastr.error('Error cargando productos', 'Error');
      }
    });
  }

  setupAutocomplete() {
    if (this.listProductosCompleta.length === 0) return;

    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProductos(this._getFilterValue(value)))
    );
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
        (producto.proDescripcion &&
          producto.proDescripcion.toLowerCase().includes(filterValue)) ||
        (producto.proSku &&
          producto.proSku.toLowerCase().includes(filterValue))
    );
  }

  displayProductoFn(producto: any): string {
    return producto && producto.proNombre ? producto.proNombre : '';
  }

  onProductoSelected(producto: any) {
    if (!producto || !producto.proId) return;

    this.productoSeleccionado = producto;
    this.productoImagen.proId = producto.proId;
    this.productoImagen.proNombre = producto.proNombre;
    this.productoImagen.proSku = producto.proSku;
    
    console.log('Producto seleccionado:', producto);
    this.toastr.success('Producto seleccionado', 'Éxito');
  }

  onProductoClear() {
    this.productoControl.reset();
    this.productoSeleccionado = null;
    this.productoImagen.proId = 0;
    this.productoImagen.proNombre = '';
    this.productoImagen.proSku = '';
  }

  actualizarTiposDisponibles() {
    // Filtrar tipos que ya están en la lista
    const tiposYaAgregados = this.listaImagenes.map(img => img.tipoId);
    this.tiposDisponibles = this.listTipoImagenesCompleta.filter(
      tipo => !tiposYaAgregados.includes(tipo.timId)
    );
    
    console.log('🔄 Tipos disponibles actualizados:', {
      total: this.listTipoImagenesCompleta.length,
      agregados: tiposYaAgregados,
      disponibles: this.tiposDisponibles.length
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.toastr.error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)', 'Error');
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('El archivo es demasiado grande. Máximo 5MB', 'Error');
        return;
      }

      this.archivoTemporal = file;
      
      // Generar vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewTemporal = e.target.result;
      };

      console.log("Lista imagenes:");      
      console.log(this.listaImagenes.length);
      
      reader.readAsDataURL(file);
    }
  }

  agregarImagenALista() {
    if (!this.tipoImagenSeleccionado || !this.archivoTemporal) {
      this.toastr.warning('Debe seleccionar un tipo de imagen y un archivo', 'Advertencia');
      return;
    }

    if (!this.productoImagen.proId) {
      this.toastr.warning('Debe seleccionar un producto primero', 'Advertencia');
      return;
    }

    // Buscar el nombre del tipo
    const tipoEncontrado = this.listTipoImagenesCompleta.find(
      t => t.timId === this.tipoImagenSeleccionado
    );

    if (!tipoEncontrado) {
      this.toastr.error('Tipo de imagen no encontrado', 'Error');
      return;
    }

    // Verificar que no se duplique (seguridad adicional)
    const yaCargado = this.listaImagenes.find(img => img.tipoId === this.tipoImagenSeleccionado);
    if (yaCargado) {
      this.toastr.warning('Este tipo de imagen ya está agregado', 'Advertencia');
      return;
    }

    // Crear nueva imagen en la lista
    const nuevaImagen: ImagenItem = {
      tipoId: this.tipoImagenSeleccionado,
      tipoNombre: tipoEncontrado.timNombre,
      archivo: this.archivoTemporal,
      preview: this.previewTemporal!,
      isNew: true,
      _tempId: this.nextTempId--
    };

    this.listaImagenes = [...this.listaImagenes, nuevaImagen];

       this.toastr.success(`Imagen tipo "${tipoEncontrado.timNombre}" agregada`, 'Éxito');
    console.log(this.listaImagenes.length);
      console.log('Estado después de agregar imagen:');
  console.log('- Total imágenes:', this.listaImagenes.length);
  console.log('- Formulario válido:', this.editForm?.form?.valid);
  console.log('- Producto ID:', this.productoImagen.proId);
  console.log('- Validaciones formulario:', this.editForm?.form?.errors);
    this.actualizarTiposDisponibles();
    this.limpiarFormularioTemporal();
    
 
  }


puedeGuardar(): boolean {
  const valido = (this.editForm?.valid ?? false) && 
                 this.listaImagenes.length > 0 && 
                 this.productoImagen.proId > 0;
  
  console.log('¿Puede guardar?', valido, {
    formValido: this.editForm?.valid,
    imagenes: this.listaImagenes.length,
    productoId: this.productoImagen.proId
  });
  
  return valido;
}
  limpiarFormularioTemporal() {
    this.tipoImagenSeleccionado = null;
    this.archivoTemporal = null;
    this.previewTemporal = null;
  }

  eliminarImagenDeLista(item: ImagenItem) {
    this.listaImagenes = this.listaImagenes.filter(
      img => img._tempId !== item._tempId
    );
    this.actualizarTiposDisponibles();
    this.toastr.success(`Imagen tipo "${item.tipoNombre}" eliminada de la lista`, 'Éxito');
  }

  abrirImagenEnNuevaPestana(url: string) {
    window.open(url, '_blank');
  }

  getTipoColor(tipoNombre: string): string {
    const colores: any = {
      'Chico': '#2196F3',
      'Carrusel': '#4CAF50',
      'Grande': '#FF9800',
      'Inicio': '#9C27B0',
      'Mediana': '#F44336'
    };
    return colores[tipoNombre] || '#757575';
  }

  save() {
    // Validaciones
    if (this.listaImagenes.length === 0) {
      this.toastr.error('Debe agregar al menos una imagen', 'Error');
      return;
    }

    if (!this.productoImagen.proId) {
      this.toastr.error('Debe seleccionar un producto', 'Error');
      return;
    }

    // Preparar datos para enviar
    const imagenesParaEnviar = this.listaImagenes.map(img => {
      const { _tempId, ...imagenSinTempId } = img;
      return imagenSinTempId;
    });

    const datosParaGuardar = {
      proId: this.productoImagen.proId,
      imagenes: imagenesParaEnviar
    };

    // Llamar al servicio
    this.productoImagenService.saveBatch(datosParaGuardar).subscribe({
      next: result => {
        if (result && result.proId > 0) {
          const mensaje = this.isEditMode 
            ? 'Las imágenes del producto han sido actualizadas exitosamente' 
            : 'Las imágenes del producto han sido guardadas exitosamente';
          this.toastr.success(mensaje, 'Transacción exitosa');
          this.productoImagenService.setIsUpdated(true);
          this.dialogRef.close(result);
        } else {
          this.toastr.error('Ha ocurrido un error al guardar', 'Error');
        }
      },
      error: err => {
        console.error('Error al guardar:', err);
        const errorMsg = err.error?.error || err.error?.message || 'Ha ocurrido un error';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}