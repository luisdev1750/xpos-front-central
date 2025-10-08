import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductoImagenFilter } from '../producto-imagen-filter';
import { ProductoImagenService } from '../producto-imagen.service';
import { ProductoImagen } from '../producto-imagen';
import { ProductoImagenEditComponent } from '../producto-imagen-edit/producto-imagen-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../producto/producto.service';
import { ProductoImagenBusquedaComponent } from '../producto-imagen-busqueda/producto-imagen-busqueda.component';

@Component({
  selector: 'app-producto-imagen',
  standalone: false,
  templateUrl: 'producto-imagen-list.component.html',
  styles: [
    'table { }',
    '.mat-column-actions {flex: 0 0 10%;}',
    '.image-thumbnail { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; cursor: pointer; }',
    '.image-thumbnail:hover { opacity: 0.8; transform: scale(1.05); transition: all 0.2s; }'
  ],
})
export class ProductoImagenListComponent implements OnInit {
  displayedColumns = ['priNombre', 'priProId', 'priTimId', 'actions'];
  filter = new ProductoImagenFilter();
  searchText: string = '';
  private subs!: Subscription;
  listProductosImagenes: any = [];
  listTipoImagenes: any = [];
  isEditing: boolean = false;

  constructor(
    private productoImagenService: ProductoImagenService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private productoService: ProductoService
  ) {
    this.subs = this.productoImagenService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.priId = '0';
    this.filter.priTimId = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  clearSearch() {
    this.searchText = '';
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  // AGREGADO: Método para obtener la URL de la imagen
  getImageUrl(item: any): string {
    if (item.priProId && item.priNombre) {
      return this.productoImagenService.getImageUrl(item.priProId, item.priNombre);
    }
    return '';
  }

  // AGREGADO: Método para abrir imagen en nueva pestaña
  openImageInNewTab(item: any): void {
    const url = this.getImageUrl(item);
    if (url) {
      window.open(url, '_blank');
    }
  }

  loadCatalogs() {
    this.productoImagenService
      .find({
        priId: '0',
        priTimId: '0',
        priProId: '0',
      })
      .subscribe({
        next: (result) => {
          this.listProductosImagenes = result;
        },
        error: (err) => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        },
      });

    this.productoImagenService.findTipoImagenes().subscribe({
      next: (result) => {
        console.log(result);
        this.listTipoImagenes = result;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  onTipoImagenChange(event: any) {
    this.filter.priTimId = event.value;
    this.search();
  }

  searchProducts(word: string) {
    this.productoImagenService.findByWord(word).subscribe({
      next: (result) => {
        this.listProductosImagenes = result;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }

  get productoImagenList(): ProductoImagen[] {
    return this.productoImagenService.productoImagenList;
  }

  add() {
    let newProductoImagen: ProductoImagen = new ProductoImagen();
    this.isEditing = false;
    this.edit(newProductoImagen);
  }

  delete(productoImagen: ProductoImagen): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar la imagen del producto?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.productoImagenService.delete(productoImagen).subscribe({
          next: (result) => {
            if (result && (result.priId > 0 || result.message)) {
              this.toastr.success(
                'La imagen del producto ha sido eliminada exitosamente',
                'Transacción exitosa'
              );
              this.productoImagenService.setIsUpdated(true);
            } else {
              this.toastr.error('Ha ocurrido un error', 'Error');
            }
          },
          error: (err) => {
            const errorMsg = err.error?.error || err.error?.message || 'Ha ocurrido un error';
            this.toastr.error(errorMsg, 'Error');
          },
        });
      }
    });
  }

  edit(ele: ProductoImagen, isEditing: boolean = false) {
    if (!isEditing) {
      this.dialog.open(ProductoImagenBusquedaComponent, {
        data: { productoImagen: JSON.parse(JSON.stringify(ele)) },
        height: '500px',
        width: '700px',
        maxWidth: 'none',
        disableClose: true,
      });
    } else {
      this.dialog.open(ProductoImagenEditComponent, {
        data: { productoImagen: JSON.parse(JSON.stringify(ele)) },
        height: '500px',
        width: '700px',
        maxWidth: 'none',
        disableClose: true,
      });
    }
  }

  search(): void {
    this.productoImagenService.find(this.filter).subscribe({
      next: (result) => {
        this.listProductosImagenes = result;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
}