import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { Nivel } from '../nivel';
import { NivelEditComponent } from '../nivel-edit/nivel-edit.component';
import { NivelFilter } from '../nivel-filter';
import { NivelService } from '../nivel.service';


@Component({
  selector: 'app-nivel',
  templateUrl: 'nivel-list.component.html',
  styleUrls: ['nivel-list.component.css'],
})
export class NivelListComponent implements OnInit, OnDestroy {
  displayedColumns = ['nivId', 'nivDescripcion', 'actions'];
  filter = new NivelFilter();
  selectedNivel!: Nivel;

  private subs!: Subscription;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /* Inicialización */

  constructor(
    private nivelService: NivelService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paginatoor: MatPaginatorIntl
  ) {
    this.paginatoor.itemsPerPageLabel = 'Elementos por página';
    this.paginatoor.nextPageLabel = 'Siguiente página';
    this.paginatoor.previousPageLabel = 'Página anterior';
    this.paginatoor.firstPageLabel = 'Primera página';
    this.paginatoor.lastPageLabel = 'Última página';

    this.paginatoor.getRangeLabel = (
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
    this.subs = this.nivelService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.nivId = '';

    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get nivelList(): Nivel[] {
    return this.nivelService.nivelList.filter((nivel) => {
      return nivel.nivFechaBaja == null;
    });
  }

  /* Métodos */

  add() {
    let newNivel: Nivel = new Nivel();

    newNivel.nivId = Number(this.filter.nivId);

    this.edit(newNivel);
  }

  delete(nivel: Nivel): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el nivel? ',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.nivelService.delete(nivel).subscribe(
          () => {
            this.toastr.success(
              'El nivel ha sido eliminado exitosamente',
              'Transacción exitosa'
            );
            this.nivelService.setIsUpdated(true);
          },
          (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
      }
    });
  }

  edit(ele: Nivel) {
    this.dialog.open(NivelEditComponent, {
      data: ele,
    });
  }

  search(): void {
    this.nivelService.load().subscribe(
      (data) => {
        this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
        this.dataSource.paginator = this.paginator; // Asignamos el paginador
      },
      (err) => {
        console.error('Error al cargar niveles', err);
      }
    );
  }

  select(selected: Nivel): void {
    this.selectedNivel = selected;
  }
}
