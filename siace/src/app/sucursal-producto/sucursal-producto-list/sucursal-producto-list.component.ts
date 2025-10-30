import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SucursalProductoFilter } from '../sucursal-producto-filter';
import { SucursalProductoService } from '../sucursal-producto.service';
import { SucursalProducto } from '../sucursal-producto';
import { SucursalProductoEditComponent } from '../sucursal-producto-edit/sucursal-producto-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../../sucursal/sucursal.service';
import { SucursalProductoBusquedaComponent } from '../sucursal-producto-busqueda/sucursal-producto-busqueda.component';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sucursal-producto',
  standalone: false,
  templateUrl: 'sucursal-producto-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class SucursalProductoListComponent implements OnInit {
  displayedColumns = ['supProId', 'supSucId', 'supLprId', 'actions'];
  filter = new SucursalProductoFilter();
  listSucursales: any = [];
  private subs!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<SucursalProducto>();
  /* Inicialización */

  constructor(
    private sucursalProductoService: SucursalProductoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.sucursalProductoService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.supSucId = '0';
    this.filter.supProId = '0';
    this.filter.supLprId = '0';
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  onSucursalChange(event: any) {
    this.filter.supSucId = event.value;
    this.search();
  }

  loadCatalogs() {
    this.sucursalService.findAll().subscribe({
      next: (result) => {
        // this.sucursalService.sucursalList = result;
        console.log(result);
        this.listSucursales = result;
      },

      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  /* Accesors */

  get sucursalProductoList(): SucursalProducto[] {
    return this.sucursalProductoService.sucursalProductoList;
  }

  /* Métodos */

  add() {
    let newSucursalProducto: SucursalProducto = new SucursalProducto();
    this.dialog.open(SucursalProductoBusquedaComponent, {
      data: {
        sucursalProducto: JSON.parse(JSON.stringify(newSucursalProducto)),
        listSucursales: this.listSucursales,
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
    return;
    this.edit(newSucursalProducto);
  }

  delete(sucursalProducto: SucursalProducto): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el producto por sucursal?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sucursalProductoService.delete(sucursalProducto).subscribe({
          next: (result) => {
            if (
              result.supProId !== undefined &&
              result.supProId != null &&
              Number(result.supProId) >= 0
            ) {
              this.toastr.success(
                'El producto por sucursal ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.sucursalProductoService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: SucursalProducto) {
    this.dialog.open(SucursalProductoEditComponent, {
      data: {
        sucursalProducto: JSON.parse(JSON.stringify(ele)),
        listSucursales: this.listSucursales,
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
   //  this.sucursalProductoService.load(this.filter);
   this.sucursalProductoService.find(this.filter).subscribe( (data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    },
    (err) => {
      console.error('Error al cargar datos', err);
    })
  }
}
