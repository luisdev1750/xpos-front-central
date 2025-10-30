import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PerfilFilter } from '../perfil-filter';
import { PerfilService } from '../perfil.service';
import { Perfil } from '../perfil';
import { PerfilEditComponent } from '../perfil-edit/perfil-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: 'perfil-list.component.html',
  styles: [
    `
      table {
        width: 100%;
      }

      .mat-mdc-cell,
      .mat-mdc-header-cell {
        word-break: break-word !important;
        white-space: normal !important;
        overflow-wrap: break-word !important;
        padding: 8px !important;
      }

      .mat-column-perNombre {
        flex: 0 0 30% !important;
        min-width: 200px;
      }

      .mat-column-perClave {
        flex: 0 0 20% !important;
        min-width: 150px;
      }

      .mat-column-perActivo {
        flex: 0 0 15% !important;
        text-align: center;
      }

      .mat-column-actions {
        flex: 0 0 15% !important;
      }

      .mat-mdc-row {
        min-height: 48px;
        height: auto !important;
      }
    `,
  ],
})
export class PerfilListComponent implements OnInit {
  displayedColumns = ['perNombre', 'perClave', 'perActivo', 'actions'];
  filter = new PerfilFilter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Perfil>();
  private subs!: Subscription;

  /* Inicialización */

  constructor(
    private perfilService: PerfilService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.perfilService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.perId = '0';
    this.filter.perActivo = 'all';
    this.filter.perNombre = 'all';
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

  get perfilList(): Perfil[] {
    return this.perfilService.perfilList;
  }

  onActivoChange() {
    this.search();
  }
  /* Métodos */

  add() {
    let newPerfil: Perfil = new Perfil();

    this.edit(newPerfil);
  }
  changeRoute(item: Perfil) {
    this.router.navigate([`/menu-perfil/${item.perId}`]);
  }

  delete(perfil: Perfil): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el perfil?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(perfil).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El perfil ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.perfilService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Perfil) {
    this.dialog.open(PerfilEditComponent, {
      data: { perfil: JSON.parse(JSON.stringify(ele)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    // this.perfilService.load(this.filter);
    this.perfilService.find(this.filter).subscribe(
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
