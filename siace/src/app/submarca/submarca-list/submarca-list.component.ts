import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubmarcaFilter } from '../submarca-filter';
import { SubmarcaService } from '../submarca.service';
import { Submarca } from '../submarca';
import { SubmarcaEditComponent } from '../submarca-edit/submarca-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from '../../marca/marca.service';
import { Marca } from '../../marca/marca';

@Component({
  selector: 'app-submarca',
  standalone: false,
  templateUrl: 'submarca-list.component.html',
  styles: ['table {  }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class SubmarcaListComponent implements OnInit {
  displayedColumns = ['smaId', 'smaMarId', 'smaNombre', 'smaActivo', 'actions'];
  filter = new SubmarcaFilter();
  marcaListsFilter: Marca[] = [];
  private subs!: Subscription;
  all = 'all';

  /* Inicialización */

  constructor(
    private submarcaService: SubmarcaService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private submarca: SubmarcaService,
    private marca: MarcaService
  ) {
    this.subs = this.submarcaService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.smaId = '0';
    this.filter.smaMarId = '0';
      this.filter.smaActivo = 'all';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogos();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  loadCatalogos() {
    this.marca.find({ marActivo: 'true', marId: '0' }).subscribe({
      next: (result) => {
        this.marcaListsFilter = result;
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      },
    });
  }
  OnMarcaChange(event: any) {
    this.filter.smaMarId = event.value;
    this.search();
  }
  /* Accesors */

  get submarcaList(): Submarca[] {
    return this.submarcaService.submarcaList;
  }

  /* Métodos */

  onActivoModelChange(value: boolean) {
    console.log('Valor cambiado:', value);
    this.search();
  }

  add() {
    let newSubmarca: Submarca = new Submarca();

    this.edit(newSubmarca);
  }

  delete(submarca: Submarca): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el submarca?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.submarcaService.delete(submarca).subscribe({
          next: (result) => {
            if (Number(result) > 0) {
              this.toastr.success(
                'El submarca ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.submarcaService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Submarca) {
    this.dialog.open(SubmarcaEditComponent, {
      data: {
        submarca: JSON.parse(JSON.stringify(ele)),
        marcaListsFilter: this.marcaListsFilter,
      },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.submarcaService.load(this.filter);
  }
}
