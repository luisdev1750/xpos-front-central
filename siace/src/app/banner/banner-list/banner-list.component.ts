import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerFilter } from '../banner-filter';
import { BannerService } from '../banner.service';
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
    'table { min-width: 700px }',
    '.mat-column-actions {flex: 0 0 20%;}',
  ],
})
export class BannerListComponent implements OnInit {
  displayedColumns = ['id', 'sucursal', 'nombre', 'orden', 'activo', 'actions'];
  filter: any = { sucursal: '0', activo: '' };
  private subs!: Subscription;

  constructor(
    private bannerService: BannerService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.subs = this.bannerService.getIsUpdated().subscribe(() => {
      this.search();
    });
  }

  ngOnInit(): void {
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
    this.searchById();
  }

  onSucursalChange(): void {
    this.searchById();
  }

  searchById(): void {
    this.bannerService.load(this.filter);
  }

  search(): void {
    this.bannerService.loads();
  }
}
