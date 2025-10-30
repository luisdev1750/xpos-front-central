import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MarcaFilter } from '../marca-filter';
import { MarcaService } from '../marca.service';
import { Marca } from '../marca';
import { MarcaEditComponent } from '../marca-edit/marca-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-marca',
  standalone: false,
  templateUrl: 'marca-list.component.html',
  styles: [
    'table { min-width: 600px }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class MarcaListComponent implements OnInit {
  displayedColumns = ['marNombre', 'marActivo', 'actions'];
  filter = new MarcaFilter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Marca>();
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private marcaService: MarcaService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.marcaService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.marId = '0';
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
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get marcaList(): Marca[] {
    return this.marcaService.marcaList;
  }

  /* Métodos */

  add() {
    let newMarca: Marca = new Marca();

    this.edit(newMarca);
  }

  onActivoChange(): void {
    this.search();
  }

  delete(marca: Marca): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el marca?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.marcaService.delete(marca).subscribe({
          next: (result) => {
            if (
              result?.marId !== undefined &&
              result?.marId !== null &&
              Number(result.marId) >= 0
            ) {
              this.toastr.success(
                'El marca ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.marcaService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Marca) {
    this.dialog.open(MarcaEditComponent, {
      data: { marca: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
   //  this.marcaService.load(this.filter);
   this.marcaService.find(this.filter).subscribe(
          (data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    },
    (err) => {
      console.error('Error al cargar datos', err);
    }
   )
  }
}
