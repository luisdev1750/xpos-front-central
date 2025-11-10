import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoSugeridoService } from '../producto-sugerido.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProductoSugeridoEditComponent } from '../producto-sugerido-edit/producto-sugerido-edit.component';
import { SucursalService } from '../../sucursal/sucursal.service';
import { ProductoSugeridoFilter } from '../producto-sugerido-filter';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-producto-sugerido-list',
  standalone: false,
  templateUrl: './producto-sugerido-list.component.html',
  styles: [
    'table { min-width: 600px; width: 100%; }',
    '.mat-column-actions { flex: 0 0 150px; }',
  ],
})
export class ProductoSugeridoListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'sucNombreSel',
    'proNombreSel',
    'lprNombreSel',
    'proActivoSel',
    'actions',
  ];

  filter = new ProductoSugeridoFilter();

  private subs!: Subscription;
  listSucursales: any[] = [];
  listProductosSugeridos: any[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();

  constructor(
    private productoSugeridoService: ProductoSugeridoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.productoSugeridoService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.sucId = '0';
    this.filter.activo = 'all';
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
  }

  onSucursalChange(event: any) {
    this.filter.sucId = event.value;
    this.search();
  }

  onActivoChange(): void {
    this.search();
  }

  loadCatalogs() {
    // Cargar sucursales
    this.sucursalService
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

    // Cargar productos sugeridos iniciales
    this.search();
  }

  search(): void {
    this.productoSugeridoService
      .find({
        sucId: this.filter.sucId,
        activo: this.filter.activo,
      })
      .subscribe(
        (res) => {
          console.log('Productos sugeridos cargados:', res);
          this.listProductosSugeridos = res;
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log('Error al cargar productos sugeridos:', error);
          this.toastr.error('Error al cargar productos sugeridos', 'Error');
        }
      );
  }

  add() {
    let newProductoSugerido: any = {
      sucIdSel: 0,
      proIdSel: 0,
      lprIdSel: 0,
      productosSugeridos: [],
    };

    this.edit(newProductoSugerido, false);
  }

  edit(productoSugerido: any, isEditMode: boolean = true) {
    this.dialog.open(ProductoSugeridoEditComponent, {
      data: { 
        productoSugerido: JSON.parse(JSON.stringify(productoSugerido)),
        isEditMode: isEditMode,
        sucursalFilter: this.filter.sucId
      },
      height: '600px',
      width: '900px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  delete(productoSugerido: any): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: `¿Está seguro de eliminar todas las sugerencias del producto "${productoSugerido.proNombreSel}"?`,
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoSugeridoService
          .delete(
            productoSugerido.sucIdSel,
            productoSugerido.proIdSel,
            productoSugerido.lprIdSel
          )
          .subscribe({
            next: (result) => {
              if (result.message) {
                this.toastr.success(
                  'Las sugerencias han sido eliminadas exitosamente',
                  'Transacción exitosa'
                );
                this.search();
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
}