import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FamiliaFilter } from '../familia-filter';
import { FamiliaService } from '../familia.service';
import { Familia } from '../familia';
import { FamiliaEditComponent } from '../familia-edit/familia-edit.component';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SubmarcaService } from '../../submarca/submarca.service';
import { Submarca } from '../../submarca/submarca';

@Component({
  selector: 'app-familia',
  standalone: false,
  templateUrl: 'familia-list.component.html',
  styles: ['table {  }', '.mat-column-actions {flex: 0 0 10%;}'],
})
export class FamiliaListComponent implements OnInit {
  displayedColumns = [
    'famId',
    'famSmaId',
    'famIdParent',
    'famNombre',
    'famSku',
    'famActivo',
    'actions',
  ];
  filter = new FamiliaFilter();

  private subs!: Subscription;
  submarcasLists: Submarca[] = [];
  familiasListFilter: Familia[] = [];
  submarcasListsFilter: Submarca[] = [];

  selectedNecesidadesIds: number = 0;
  /* Inicialización */

  constructor(
    private familiaService: FamiliaService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private submarca: SubmarcaService
  ) {
    this.subs = this.familiaService.getIsUpdated().subscribe(() => {
      this.search();
    });

    this.filter.famId = '0';
    this.filter.famSmaId = '0';
    this.filter.famIdParent = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogos();
  }

  // Para Submarca
onSubmarcaChange(event: any) {
  this.filter.famSmaId = event.value; // Actualiza el filtro
  this.search(); // Ejecuta la búsqueda
}

// Para Familia Padre
onFamiliaPadreChange(event: any) {
  this.filter.famIdParent = event.value; // Actualiza el filtro
  this.search(); // Ejecuta la búsqueda
}

  onFamiliaChange(event: any) {
    console.log('Familia seleccionada:', event.value);
    this.search(); // Ejecuta tu función
  }

  loadCatalogos() {
    this.submarca
      .find({ smaId: '0', smaMarId: '0', smaActivo: 'true' })
      .subscribe({
        next: (result) => {
          console.log('Submarcas cargadas:', result);
          // Aquí puedes manejar la lista de submarcas si es necesario
          this.submarcasListsFilter = result;
            this.submarcasLists = result;
        },
        error: (err) => {
          this.toastr.error('Error al cargar las submarcas', 'Error');
        },
      });

    this.familiaService
      .find({ famId: '0', famSmaId: '0', famIdParent: '0' })
      .subscribe({
        next: (result) => {
          console.log('Familias cargadas:', result);
          // Aquí puedes manejar la lista de familias si es necesario
          this.familiasListFilter = result;
        },
        error: (err) => {
          this.toastr.error('Error al cargar las familias', 'Error');
        },
      });
  }

  onSelectionChange(event: any) {
    this.selectedNecesidadesIds = event.value; // Captura los valores seleccionados
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  /* Accesors */

  get familiaList(): Familia[] {
    return this.familiaService.familiaList;
  }

  /* Métodos */

  add() {
    let newFamilia: Familia = new Familia();

    this.edit(newFamilia);
  }

  delete(familia: Familia): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar el familia?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.familiaService.delete(familia).subscribe({
          next: (result) => {
            if (result) {
              this.toastr.success(
                'El familia ha sido eliminado exitosamente',
                'Transacción exitosa'
              );
              this.familiaService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Familia) {
    this.dialog.open(FamiliaEditComponent, {
      data: { familia: JSON.parse(JSON.stringify(ele)), submarcasListsFilter: this.submarcasListsFilter, familiasListFilter: this.familiasListFilter },
      height: '500px',
      width: '700px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.familiaService.load(this.filter);
  }
}
