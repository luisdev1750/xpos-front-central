import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerFilter } from '../banner-filter';
import { BannerService } from '../banner.service';
import { SucursalService } from '../../sucursal/sucursal.service';
import { BannerEditComponent } from '../banner-edit/banner-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banner-list',
  standalone: false,
  templateUrl: './banner-list.component.html',
  styleUrl: './banner-list.component.css',
})
export class BannerListComponent implements OnInit {
  displayedColumns = ['idSucursal', 'sucursal', 'actions'];
  filter = new BannerFilter();
  listSucursales: any[] = [];
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
    console.log(this.bannerSucList);
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
        banner: [], // sin id porque es nuevo
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
    console.log('id suc ' + idSuc);
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
}
