import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BancoFilter } from '../banco-filter';
import { BancoService } from '../banco.service';
import { Banco } from '../banco';
import { BancoEditComponent } from '../banco-edit/banco-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-banco',
  standalone: false,
  templateUrl: 'banco-list.component.html',
  styles: [
    'table { min-width: 600px }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class BancoListComponent implements OnInit {
  displayedColumns = ['banNombre', 'banActivo', 'actions'];
  filter = new BancoFilter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Banco>();
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private bancoService: BancoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.bancoService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.banId = '0';
    this.filter.banId = '0';
    this.filter.banActivo = '';
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
  toggleActivo(banco: Banco, isChecked: boolean): void {
    // Actualizar el estado local
    banco.banActivo = isChecked;
  }

  ngOnInit() {
    this.search();
  }

  onActivoChange(): void {
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get bancoList(): Banco[] {
    return this.bancoService.bancoList;
  }

  /* Métodos */

  add() {
    let newBanco: Banco = new Banco();

    this.edit(newBanco);
  }

  delete(banco: Banco): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el banco?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bancoService.delete(banco).subscribe({
          next: (result) => {
            if (result?.banId > 0) {
              this.toastr.success(
                'El banco ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.bancoService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Banco) {
    this.dialog.open(BancoEditComponent, {
      data: { banco: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    //  this.bancoService.load(this.filter);
    this.bancoService.find(this.filter).subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.error('Error al cargar datos', err);
      }
    );
  }
}
