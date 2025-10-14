import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoFilter } from '../producto-filter';
import { ProductoService } from '../producto.service';
import { Producto } from '../producto';
import { ProductoEditComponent } from '../producto-edit/producto-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PresentacionService } from '../../presentacion/presentacion.service';
import { FamiliaService } from '../../familia/familia.service';
import { Familia } from '../../familia/familia';
import { Presentacion } from '../../presentacion/presentacion';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-producto',
  standalone: false,
  templateUrl: 'producto-list.component.html',
  styles: [
    'table { min-width: 600px }',
    '.mat-column-actions {}',
  ],
})
export class ProductoListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'proNombre',
    'proSku',
    'proCodigoBarras',
    'proFamId',
    'proPreId',
    'proUnmId',    
    'proDevolucion',
    'proActivo',
    'proFechaAlta',
    'proFechaModificacion',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filter = new ProductoFilter();
  dataSource = new MatTableDataSource<Producto>();
  
  // Variables para búsqueda
  searchText: string = '';
  private productoBackup: Producto[] = []; // Backup de todos los productos

  private subs!: Subscription;

  /* Inicialización */
  familiaList: Familia[] = [];
  presentacionList: Presentacion[] = [];
  unidadMedidaList: any[] = [];
  
  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private presentacionService: PresentacionService,
    private familiaService: FamiliaService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.configurarPaginadorEspanol();

    this.subs = this.productoService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.proId = '0';
    this.filter.proActivo = 'all';
    this.filter.proFamId = '0';
    this.filter.proPreId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
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

  OnFamiliaChange(event: any) {
    this.filter.proFamId = event.value;
    this.searchText = ''; // Limpiar búsqueda al cambiar filtro
    this.search();
  }

  onActivoChange(): void {
    this.searchText = ''; // Limpiar búsqueda al cambiar filtro
    this.search();
  }

  OnPresentacionChange(event: any) {
    this.filter.proPreId = event.value;
    this.searchText = ''; // Limpiar búsqueda al cambiar filtro
    this.search();
  }

  loadCatalogs() {
    this.presentacionService
      .find({
        preId: '0',
        preActivo: 'all',
      })
      .subscribe(
        (result) => {
          this.presentacionList = result;
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );

    this.familiaService
      .find({ famId: '0', famSmaId: '0', famIdParent: '0' })
      .subscribe(
        (result) => {
          this.familiaList = result;
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
      
    this.productoService.findByCatalogo('listar-unidades').subscribe(
      (result) => {
        this.unidadMedidaList = result;
      },
      (error) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  /* Búsqueda en tiempo real */
  searchProducts(word: string): void {
    if (!word || word.trim().length === 0) {
      // Si el buscador está vacío, mostrar todos los productos del backup
      this.dataSource.data = [...this.productoBackup];
    } else {
      // Filtrar por múltiples campos
      const wordLower = word.toLowerCase().trim();
      const filtered = this.productoBackup.filter((item: any) =>
        item.proNombre?.toLowerCase().includes(wordLower) ||
        item.proSku?.toLowerCase().includes(wordLower) ||
        item.proCodigoBarras?.toLowerCase().includes(wordLower) ||
        item.proFamNombre?.toLowerCase().includes(wordLower) ||
        item.proPreNombre?.toLowerCase().includes(wordLower)
      );
      this.dataSource.data = filtered;
    }
    // Resetear paginador a la primera página
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.dataSource.data = [...this.productoBackup];
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  /* Accesors */
  get productoList(): Producto[] {
    return this.productoService.productoList;
  }

  /* Métodos */
  add() {
    let newProducto: Producto = new Producto();
    this.edit(newProducto);
  }

  delete(producto: Producto): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el producto?',
      },
    });

    const productoDelete: Producto = {
      ...producto,
      proActivo: false,
    };

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoService.save(productoDelete).subscribe({
          next: (result) => {
            if (
              result?.proId !== undefined &&
              result?.proId !== null &&
              Number(result.proId) >= 0
            ) {
              this.toastr.success(
                'El producto ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.productoService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Producto) {
    this.dialog.open(ProductoEditComponent, {
      data: {
        producto: JSON.parse(JSON.stringify(ele)),
        familiaList: this.familiaList,
        presentacionList: this.presentacionList,
        unidadMedidaList: this.unidadMedidaList,
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.productoService.find(this.filter).subscribe(
      (data) => {
        this.productoBackup = [...data]; // Guardar backup
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.error('Error al cargar productos', err);
      }
    );
  }
}