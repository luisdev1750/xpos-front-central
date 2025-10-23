import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PresentacionFilter } from '../presentacion-filter';
import { PresentacionService } from '../presentacion.service';
import { Presentacion } from '../presentacion';
import { PresentacionEditComponent } from '../presentacion-edit/presentacion-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-presentacion',
  standalone: false,
  templateUrl: 'presentacion-list.component.html',
  styles: [
    'table { min-width: 600px}',
    '.mat-column-actions {flex: 0 0 10%;}'
  ]
})
export class PresentacionListComponent implements OnInit, OnDestroy {
  displayedColumns = ['preNombre', 'preActivo', 'actions'];
  filter = new PresentacionFilter();

  // Paginador y DataSource
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Presentacion>();

  private subs!: Subscription;

  constructor(
    private presentacionService: PresentacionService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {
    // Configurar paginador en español
    this.configurarPaginadorEspanol();

    this.subs = this.presentacionService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.preId = '0';
    this.filter.preActivo = 'all';
  }

  ngOnInit() {
    this.search();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
        return `1 de ${length + 1}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };
  }

  onActivoChange(): void {
    this.search();
  }

  /* Accesors */
  get presentacionList(): Presentacion[] {
    return this.presentacionService.presentacionList;
  }

  /* Métodos */
  add() {
    let newPresentacion: Presentacion = new Presentacion();
    this.edit(newPresentacion);
  }

  delete(presentacion: Presentacion): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar la presentación?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.presentacionService.delete(presentacion).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'La presentación ha sido eliminada exitosamente',
                'Transacción exitosa'
              );
              this.presentacionService.setIsUpdated(true);
            } else {
              this.toastr.error('Ha ocurrido un error', 'Error');
            }
          },
          error: err => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        });
      }
    });
  }

  edit(ele: Presentacion) {
    this.dialog.open(PresentacionEditComponent, {
      data: { presentacion: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true
    });
  }

  search(): void {
    this.presentacionService.find(this.filter).subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.error('Error al cargar presentaciones', err);
      }
    );
  }
}