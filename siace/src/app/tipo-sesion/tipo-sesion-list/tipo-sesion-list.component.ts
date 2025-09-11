import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ConfirmDialogComponent,
} from '../../common/confirm-dialog/confirm-dialog.component';
import { TipoSesion } from '../tipo-sesion';
import {
  TipoSesionEditComponent,
} from '../tipo-sesion-edit/tipo-sesion-edit.component';
import { TipoSesionFilter } from '../tipo-sesion-filter';
import { TipoSesionService } from '../tipo-sesion.service';


@Component({
  selector: 'app-tipo-sesion',
  templateUrl: 'tipo-sesion-list.component.html',
  styleUrls: ['tipo-sesion-list.component.css'],
})
export class TipoSesionListComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'tisId',
    'tisNombre',
    'tiaNombre',
    'tisDuracion',
    'tisLineamiento',
    'actions',
  ];
  //displayedColumnsName = ['clave','Nombre','Tipo de Aspecto','Duración','Lineamiento','Acciones'];

  displayedColumnsName: { [key: string]: string } = {
    tisId: 'Clave',
    tisNombre: 'Nombre',
    tiaNombre: 'Tipo de Aspecto',
    tisDuracion: 'Duración',
    tisLineamiento: 'Lineamiento',
    actions: 'Acciones',
  };

  filter = new TipoSesionFilter();
  selectedTipoSesion!: TipoSesion;

  private subs!: Subscription;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  /* Inicialización */

  constructor(
    private tipoSesionService: TipoSesionService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subs = this.tipoSesionService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.tisId = '';

    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get tipoSesionList(): TipoSesion[] {
    return this.tipoSesionService.tipoSesionList;
  }

  /* Métodos */

  add() {
    let newTipoSesion: TipoSesion = new TipoSesion();

    newTipoSesion.tisId = Number(this.filter.tisId);

    this.edit(newTipoSesion);
  }

  delete(tipoSesion: TipoSesion): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el tipoSesion? ',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.tipoSesionService.delete(tipoSesion).subscribe(
          () => {
            this.toastr.success(
              'El tipoSesion ha sido guardado exitosamente',
              'Transacción exitosa'
            );
            this.tipoSesionService.setIsUpdated(true);
          },
          (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
      }
    });
  }

  edit(ele: TipoSesion) {
    this.dialog.open(TipoSesionEditComponent, {
      data: ele,
      height: '550px',
      minWidth: '60vw',
      maxWidth: '400px',
    });
  }

  search(): void {
   this.tipoSesionService.load().subscribe(
      data => {
         this.dataSource.data = data; // Asignamos los datos al MatTableDataSource
         this.dataSource.paginator = this.paginator; // Asignamos el paginador
      },
      err => {
         console.error('Error al cargar tipos de sesión', err);
      }
   );
}


  select(selected: TipoSesion): void {
    this.selectedTipoSesion = selected;
    console.log('Tipo seleccionada');
  }
}
