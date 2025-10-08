import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerFilter } from '../banner-filter';
import { BannerService } from '../banner.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { Banner } from '../banner';
import { BannerEditComponent } from '../banner-edit/banner-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banco',
  standalone: false,
  templateUrl: './banner-list.component.html',
  styles: [
    'table { min-width: 800px }',
    '.mat-column-actions {flex: 0 15% 20%;}',
  ],
})
export class BannerListComponent implements OnInit {
  displayedColumns = ['id', 'sucursal', 'nombre', 'orden', 'activo', 'actions'];
  filter = new BannerFilter();
  listSucursales: any[] = [];
  private subs!: Subscription;

  constructor(
    private bannerService: BannerService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalSerivice: SucursalService
  ) {
    this.subs = this.bannerService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.filter.subSucId = '0';
    this.filter.subActivo = '';
  }

  ngOnInit(): void {
    this.loadCatalogs();
    this.search();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  get bannerList(): Banner[] {
    return this.bannerService.bannerList;
  }

  add(): void {
    const newBanner: Banner = new Banner();
    this.edit(newBanner);
  }

  edit(banner: Banner): void {
    this.dialog.open(BannerEditComponent, {
      data: { banner: JSON.parse(JSON.stringify(banner)) },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  delete(banner: Banner): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el banner?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bannerService.delete(banner).subscribe({
          next: (res) => {
            this.toastr.success('Banner eliminado exitosamente', 'Éxito');
            this.bannerService.setIsUpdated(true);
          },
          error: (err) => this.toastr.error('Ha ocurrido un error', 'Error'),
        });
      }
    });
  }

  onActivoChange(): void {
    this.search();
  }

  onSucursalChange(): void {
    this.search();
  }

  search(): void {
    this.bannerService.load(this.filter);
  }

  loadCatalogs() {
    // Cargar sucursales
    this.sucursalSerivice
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
  }
}
