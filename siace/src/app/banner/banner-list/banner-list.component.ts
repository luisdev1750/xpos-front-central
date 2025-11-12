import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerFilter } from '../banner-filter';
import { BannerService } from '../banner.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { BannerEditComponent } from '../banner-edit/banner-edit.component';
import { BannerCopyDialogComponent } from '../banner-copy/banner-copy-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';

// 👇 Interfaz para el banner
interface Banner {
  subId: number;
  subSucId: number;
  subNombre: string;
  subOrden: number;
  subActivo: boolean;
}

@Component({
  selector: 'app-banner-list',
  standalone: false,
  templateUrl: './banner-list.component.html',
  styleUrl: './banner-list.component.css',
})
export class BannerListComponent implements OnInit {
  displayedColumns = ['select', 'idSucursal', 'sucursal', 'actions'];
  filter = new BannerFilter();
  listSucursales: any[] = [];
  selection = new SelectionModel<number>(true, []); // Selección de SubSucId
  private subs!: Subscription;
  isEditing: boolean = false;

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
    this.isEditing = false;
    this.bannerService.bannersUpdated$.subscribe((updated) => {
      if (updated) {
        this.loadCatalogs();
        this.search();
        this.isEditing = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  add(idSuc?: string | number): void {
    const selectedSucId = this.filter.subSucId;
    this.dialog.open(BannerEditComponent, {
      data: {
        banner: [],
        listSucursales: this.listSucursales,
        selectedSucId: selectedSucId,
        isEditing: true,
      },
      height: '80vh',
      width: '75vw',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });
  }

  onActivoChange(): void {
    this.search();
  }

  onSucursalChange(): void {
    this.selection.clear();
    this.search();
  }

  search(): void {
    this.bannerService.load(this.filter);
  }

  loadCatalogs() {
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
          this.listSucursales = res;
        },
        (error) => {
          this.toastr.error('Error al cargar sucursales', 'Error');
        }
      );
  }

  getNombreSucursal(id: number): string {
    const sucursal = this.listSucursales.find((s) => s.sucId === id);
    return sucursal ? sucursal.sucNombre : '—';
  }

  get bannerSucList(): number[] {
    return [
      ...new Set(this.bannerService.bannerList.map((b) => b.subSucId)),
    ].sort((a, b) => a - b);
  }

  editSuc(idSuc: number[]): void {
    this.dialog.open(BannerEditComponent, {
      data: {
        banner: JSON.parse(JSON.stringify(idSuc)),
        listSucursales: this.listSucursales,
        bannerSucList: this.bannerSucList,
        isEditing: false,
      },
      height: '80vh',
      width: '75vw',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });
  }

  // ========== MÉTODOS PARA SELECCIÓN Y COPIA ==========

  /** Si todas las filas están seleccionadas */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.bannerSucList.length;
    return numSelected === numRows;
  }

  /** Seleccionar/deseleccionar todas las filas */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.bannerSucList.forEach((row) => this.selection.select(row));
  }

  /** Abrir diálogo para copiar banners */
  copiarBannersSeleccionados(): void {
    if (this.selection.selected.length === 0) {
      this.toastr.warning(
        'Selecciona al menos una sucursal para copiar sus banners',
        'Advertencia'
      );
      return;
    }

    // Obtener todos los banners de las sucursales seleccionadas
    const bannersSeleccionados = this.bannerService.bannerList.filter(
      (banner) => this.selection.selected.includes(banner.subSucId)
    );

    const dialogRef = this.dialog.open(BannerCopyDialogComponent, {
      width: '500px',
      data: {
        bannersSeleccionados: bannersSeleccionados.length,
        sucursalesSeleccionadas: this.selection.selected.length,
        sucursales: this.listSucursales.filter(
          (s) => !this.selection.selected.includes(s.sucId)
        ),
      },
    });

    dialogRef.afterClosed().subscribe((result: { sucursalId: number }) => {
      if (result && result.sucursalId) {
        this.ejecutarCopiaBanners(result.sucursalId);
      }
    });
  }

  /** Ejecutar la copia de banners */
  private ejecutarCopiaBanners(targetSucursalId: number): void {
    // 👇 Mapear los banners con su clave primaria completa (SubId + SubSucId)
    const banners = this.bannerService.bannerList
      .filter((banner) => this.selection.selected.includes(banner.subSucId))
      .map((banner) => ({
        subId: banner.subId,
        subSucId: banner.subSucId,
      }));

    console.log('Banners a copiar:', banners);

    this.bannerService
      .copyBannersToSucursal(banners, targetSucursalId)
      .subscribe({
        next: (response) => {
          console.log('Respuesta de copia:', response);

          if (response.data.success) {
            const copiados = response.data.copiados || 0;
            const errores = response.data.detalles || [];
            const erroresArchivos = response.erroresArchivos || [];

            let mensaje = `Se copiaron ${copiados} banner(s) exitosamente`;

            if (erroresArchivos.length > 0) {
              mensaje += `, pero hubo ${erroresArchivos.length} error(es) al copiar archivos de imagen`;
            }

            this.toastr.success(mensaje, 'Operación exitosa', {
              timeOut: 5000,
            });

            if (errores.length > 0) {
              this.toastr.warning(
                `Advertencias: ${errores.join(', ')}`,
                'Atención',
                { timeOut: 5000 }
              );
            }

            if (erroresArchivos.length > 0) {
              this.toastr.warning(
                `Errores en archivos: ${erroresArchivos.join(', ')}`,
                'Atención',
                { timeOut: 5000 }
              );
            }

            this.selection.clear();
            this.search();
          } else {
            this.toastr.error(
              response.data.detalles?.join(', ') ||
                'No se pudo copiar ningún banner',
              'Error'
            );
          }
        },
        error: (err) => {
          console.error('Error al copiar banners:', err);
          this.toastr.error(
            err.error?.message || 'Error al copiar los banners',
            'Error'
          );
        },
      });
  }
}