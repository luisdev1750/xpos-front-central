import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuPerfilFilter } from '../menu-perfil-filter';
import { MenuPerfilService } from '../menu-perfil.service';
import { MenuPerfil } from '../menu-perfil';
import { MenuPerfilEditComponent } from '../menu-perfil-edit/menu-perfil-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../perfil/perfil.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-menu-perfil',
  standalone: false,
  templateUrl: 'menu-perfil-list.component.html',
  styles: ['table { }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class MenuPerfilListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns = ['mepPerId', 'mepMenId', 'mepOrigenId','actions'];
  filter = new MenuPerfilFilter();
  perfilControl = new FormControl('0');
  private subs!: Subscription;
  listPerfiles: any[] = [];
  parentPerIdString: string = '0';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<MenuPerfil>();

  constructor(
    private menuPerfilService: MenuPerfilService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.menuPerfilService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.mepPerId = '0';
    this.filter.mepMenId = '0';
    this.filter.mepAppId = '0';
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

  ngAfterViewInit(): void {
    console.log('Paginator:', this.paginator);
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.filter.mepPerId = id;
        this.parentPerIdString = id;
      }
      this.search();
     
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogs() {
    this.perfilService
      .find({
        perId: '0',
        perActivo: 'all',
        perNombre: 'all',
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.listPerfiles = data;
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
  }

  OnChangePerfil(event: any) {
    this.filter.mepPerId = event.value;
    this.search();
  }

  onChangeApp(event: any) {
    this.filter.mepAppId = event.value;
    this.search();
  }

  get menuPerfilList(): MenuPerfil[] {
    return this.menuPerfilService.menuPerfilList;
  }

  add() {
    let newMenuPerfil: MenuPerfil = new MenuPerfil();
    this.edit(newMenuPerfil);
  }

  delete(menuPerfil: MenuPerfil): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el menú de perfil?',
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.menuPerfilService.delete(menuPerfil).subscribe({
          next: (result) => {
            if (
              result?.menuId !== undefined &&
              result?.menuId !== null &&
              Number(result.menuId) >= 0
            ) {
              this.toastr.success(
                'El perfil ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              // Esto dispara el observable que actualiza la lista
              this.menuPerfilService.setIsUpdated(true);
            } else {
              this.toastr.error('Ha ocurrido un error', 'Error');
            }
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: MenuPerfil) {
    this.dialog.open(MenuPerfilEditComponent, {
      data: {
        menuPerfil: JSON.parse(JSON.stringify(ele)),
        listPerfiles: this.listPerfiles,
        PerfilIdParent: this.filter.mepPerId,
        parentPerIdString: Number(this.parentPerIdString),
      },
      height: '500px',
      maxWidth: 'none',
      width: '700px',
      disableClose: true,
    });
  }

  search(): void {
    // this.menuPerfilService.load(this.filter);

    this.menuPerfilService.find(this.filter).subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
         this.loadCatalogs();
      },
      (error) => {
        console.log('Error al cargar datos', error);
      }
    );
  }
}
