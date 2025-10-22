import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { BannerService } from '../banner.service';
import { Banner } from '../banner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { BannerFilter } from '../banner-filter';

@Component({
  selector: 'app-banner-edit',
  standalone: false,
  templateUrl: './banner-edit.component.html',
  styleUrl: './banner-edit.component.css',
})
export class BannerEditComponent implements OnInit {
  bannerList: Banner[] = [];
  filter = new BannerFilter();
  showNewBannerRow: boolean = false; // <--- nueva bandera
  showSelected: boolean = false;
  newBanner: Banner = {
    subId: 0,
    subSucId: 0,
    subNombre: '',
    subOrden: 0,
    subActivo: true,
    imagenUrl: null,
    blobUrl: '',
  };
  displayedColumns: string[] = [
    'imagen',
    'nombre',
    'orden',
    'activo',
    'actions',
  ];
  listSucursales: any[] = [];

  /** Guardará los estados de edición por ID */
  editState: { [key: number]: boolean } = {};

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedBanner?: Banner;

  constructor(
    private dialogRef: MatDialogRef<BannerEditComponent>,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const idSuc = { ...data };
    this.filter.subSucId = idSuc.banner;
    this.filter.subActivo = '';
    this.newBanner.subSucId = idSuc.banner;
    this.listSucursales = idSuc.listSucursales;
    console.log(this.filter);
    this.bannerList = [];
  }

  ngOnInit(): void {
    this.loadBanners();
  }

  get tableData(): Banner[] {
    return this.showNewBannerRow
      ? [this.newBanner, ...this.bannerList]
      : this.bannerList;
  }

  /** Mostrar la fila de nuevo banner */
  addNewBannerRow(): void {
    this.showNewBannerRow = true;
    this.newBanner = {
      subId: 0,
      subSucId: Number(this.filter.subSucId),
      subNombre: '',
      subOrden: 0,
      subActivo: true,
      imagenUrl: null,
      blobUrl: '',
    };
  }

  selectNewImage(): void {
    this.selectedBanner = this.newBanner;
    this.fileInput.nativeElement.click();
  }

  addNewBanner(): void {
    if (!this.newBanner.subNombre || !this.newBanner.imagenUrl) {
      this.toastr.info('Debes completar nombre y seleccionar imagen', 'Banner');
      return;
    }

    if (!this.newBanner.subOrden || this.newBanner.subOrden === 0) {
      this.toastr.info('Debes agregar un orden', 'Banner');
      return;
    }

    this.bannerService.save(this.newBanner).subscribe({
      next: (res) => {
        this.toastr.success('Banner agregado correctamente', 'Éxito');
        this.showNewBannerRow = false; // Oculta la fila temporal
        this.loadBanners();
      },
      error: (err) => {
        this.toastr.error('Agregar una sucursal', 'Error');
        console.error(err);
      },
    });
  }

  /** Carga inicial de banners */
  loadBanners(): void {
    console.log(this.filter.subSucId?.toString());
    if (
      this.filter.subSucId?.toString() === '' &&
      this.newBanner.subSucId !== 0
    ) {
      this.showSelected = true;
      return;
    } else {
      this.bannerService.find(this.filter).subscribe({
        next: (result: Banner[]) => {
          this.showSelected = false;
          this.bannerList = result; // aquí ya es Banner[]
          this.loadBannerImages(); // opcional: cargar imágenes
          this.bannerList.forEach((b) => (this.editState[b.subId] = false));
        },
        error: (err) => {
          console.error('Error cargando banners', err);
          this.bannerList = [];
        },
      });
    }
  }

  loadBannerImages(): void {
    this.bannerList.forEach((banner) => {
      if (banner.subNombre) {
        this.bannerService.getImagen(banner.subNombre).subscribe({
          next: (url) => (banner.blobUrl = url),
          error: (err) => {
            console.error('Error cargando imagen', err);
            banner.blobUrl = ''; // opcional: imagen por defecto
          },
        });
      }
    });
  }
  /** Detecta cambios y activa el modo edición del banner */
  onEditChange(item: Banner): void {
    this.editState[item.subId] = true;
  }

  onChangeImage(item: Banner): void {
    this.selectedBanner = item;
    this.fileInput.nativeElement.click();
  }

  /** Subir nueva imagen y marcar banner como editado */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.selectedBanner) {
      const file = input.files[0];
      this.selectedBanner.imagenUrl = file;
      this.selectedBanner.subNombre = file.name;
      this.selectedBanner.blobUrl = URL.createObjectURL(file);
      this.editState[this.selectedBanner.subId] = true;
      this.toastr.info(`Imagen seleccionada: ${file.name}`, 'Banner');
    }
  }

  /** Actualizar cambios */
  updateBanner(item: Banner): void {
    this.bannerService.save(item).subscribe({
      next: () => {
        this.toastr.success('Banner actualizado correctamente', 'Éxito');
        this.editState[item.subId] = false;
        this.loadBanners();
      },
      error: (err) => {
        this.toastr.error('Error al actualizar el banner', 'Error');
        console.error(err);
      },
    });
  }

  /** Eliminar banner */
  deleteBanner(item: Banner): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el banco?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bannerService.delete(item).subscribe({
          next: () => {
            this.toastr.success('Banner eliminado', 'Éxito');
            this.loadBanners();
          },
          error: (err) => {
            this.toastr.error('Error al eliminar banner', 'Error');
            console.error(err);
          },
        });
      }
    });
  }

  /** Saber si un banner está en edición */
  isEditing(item: Banner): boolean {
    return this.editState[item.subId];
  }

  openImagePreview(url: string): void {
    this.dialog.open(ImagePreviewComponent, {
      data: { url },
      panelClass: 'no-padding-dialog',
      backdropClass: 'transparent-backdrop',
      hasBackdrop: true,
    });
  }
}
