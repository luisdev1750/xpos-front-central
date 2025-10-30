import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoImagenFilter } from '../producto-imagen-filter';
import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagenEditComponent } from '../producto-imagen-edit/producto-imagen-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoImagen } from '../producto-imagen';
@Component({
  selector: 'app-producto-imagen',
  standalone: false,
  templateUrl: 'producto-imagen-list.component.html',
  styles: [
    'table { }',
    '.mat-column-actions {flex: 0 0 10%;}',
    '.count-badge { display: inline-block; }',
    'mat-chip { margin: 2px !important; }',
  ],
})
export class ProductoImagenListComponent implements OnInit, OnDestroy {
  displayedColumns = ['proNombre', 'tiposImagenes', 'actions'];
  filter = new ProductoImagenFilter();
  searchText: string = '';
  private subs!: Subscription;
  listProductosImagenes: any = [];
  listProductosImagenesBackup: any = [];
  listTipoImagenes: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<ProductoImagen>();
  constructor(
    private productoImagenService: ProductoImagenService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.productoImagenService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.priId = '0';
    this.filter.priTimId = '0';
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
    this.search();
    this.loadCatalogs();
  }

  clearSearch() {
    this.searchText = '';
    this.listProductosImagenes = [...this.listProductosImagenesBackup];
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    this.productoImagenService.findTipoImagenes().subscribe({
      next: (result) => {
        this.listTipoImagenes = result;
      },
      error: (err) => {
        this.toastr.error(
          'Ha ocurrido un error al cargar tipos de imagen',
          'Error'
        );
      },
    });
  }

  onTipoImagenChange(event: any) {
    this.filter.priTimId = event.value;
    this.search();
  }

  searchProducts(word: string) {
    if (!word || word.trim().length === 0) {
      this.listProductosImagenes = [...this.listProductosImagenesBackup];
    } else {
      const wordLower = word.toLowerCase().trim();
      this.listProductosImagenes = this.listProductosImagenesBackup.filter(
        (item: any) =>
          item.proNombre?.toLowerCase().includes(wordLower) ||
          item.proSku?.toLowerCase().includes(wordLower)
      );
    }
  }

  add() {
    let newProductoImagen: any = {
      proId: 0,
      proNombre: '',
      proSku: '',
      imagenes: [], // Array vacío para nuevas imágenes
    };
    this.edit(newProductoImagen);
  }

  delete(productoImagen: any): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: `¿Está seguro de eliminar TODAS las imágenes del producto "${productoImagen.proNombre}"?`,
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoImagenService
          .deleteByProducto(productoImagen.proId)
          .subscribe({
            next: (result) => {
              if (result && result.proId > 0) {
                this.toastr.success(
                  'Las imágenes del producto han sido eliminadas exitosamente',
                  'Transacción exitosa'
                );
                this.productoImagenService.setIsUpdated(true);
              } else {
                this.toastr.error('Ha ocurrido un error', 'Error');
              }
            },
            error: (err) => {
              const errorMsg =
                err.error?.error ||
                err.error?.message ||
                'Ha ocurrido un error';
              this.toastr.error(errorMsg, 'Error');
            },
          });
      }
    });
  }

  edit(productoData: any) {
    console.log('📝 Editando producto:', productoData);

    // Asegurarse de que el objeto tenga la estructura correcta
    const productoParaEditar = {
      proId: productoData.proId || productoData.ProId,
      proNombre: productoData.proNombre || productoData.ProNombre,
      proSku: productoData.proSku || productoData.ProSku,
      // IMPORTANTE: Pasar tanto "imagenes" como "Imagenes" para compatibilidad
      imagenes:
        productoData.imagenes ||
        productoData.Imagenes ||
        productoData.tiposImagenes ||
        productoData.TiposImagenes ||
        [],
    };

    console.log('📦 Datos procesados para edición:', productoParaEditar);

    this.dialog.open(ProductoImagenEditComponent, {
      data: { productoImagen: JSON.parse(JSON.stringify(productoParaEditar)) },
      height: '700px',
      width: '900px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.productoImagenService.findAgrupados(this.filter).subscribe({
      next: (result) => {
        this.listProductosImagenes = result;
        this.listProductosImagenesBackup = [...result];
        this.searchText = '';
        this.dataSource.data = result;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  getTipoColor(tipoNombre: string): string {
    const colores: any = {
      Chico: '#2196F3',
      Carrusel: '#4CAF50',
      Grande: '#FF9800',
      Inicio: '#9C27B0',
      Mediana: '#F44336',
    };
    return colores[tipoNombre] || '#757575';
  }
}
