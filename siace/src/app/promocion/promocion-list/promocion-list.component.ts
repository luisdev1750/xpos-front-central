import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { PromocionService } from '../promocion.service';
import { PromocionFilter } from '../promocion-filter';
import { Promocion } from '../promocion';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PromocionEditComponent } from '../promocion-edit/promocion-edit.component';
import { SucursalService } from '../../sucursal/sucursal.service';
import { TipoPromocionService } from '../../tipo-promocion/tipo-promocion.service';
import { TipoPagoService } from '../../tipo-pago/tipo-pago.service';
import { TipoSubpagoService } from '../../tipo-subpago/tipo-subpago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-promocion',
  standalone: false,
  templateUrl: 'promocion-list.component.html',
  styles: [
    'table { max-width: 600px  }',
    '.mat-column-actions {flex: 0 0 10%;}',
  ],
})
export class PromocionListComponent implements OnInit {
  // Columnas adaptadas para la entidad Promocion original
  displayedColumns = [
    'pmoNombre',
    'pmoFechaInicio',
    'pmoFechaFin',
    'pmoTprId',
    'pmoTpaId',
    'pmoSpaId',
    'pmoPolitica',

    'pmoLimiteCantidad',
    'pmoSucId',
    'actions',
  ];
  filter = new PromocionFilter();
  listTipoPromocion: any[] = [];
  listSucursales: any[] = [];
  private subs!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Promocion>();
  /* Inicialización */

  constructor(
    private promocionService: PromocionService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService,
    private tipoPromocionService: TipoPromocionService,
    private tipoPagosService: TipoPagoService,
    private tipoSubpagoService: TipoSubpagoService,
    private router: Router,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.subs = this.promocionService.getIsUpdated().subscribe(() => {
      this.search();
    });
    this.configurarPaginadorEspanol();
    this.filter.pmoId = '0';
    this.filter.pmoSucId = '0';
    this.filter.pmoTpr = '0';
  }

  ngOnInit() {
    this.search();
    this.loadCatalogs();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
  loadCatalogs() {
    this.sucursalService.findAll().subscribe(
      (res) => {
        console.log('Response');
        console.log(res);
        this.listSucursales = res;
      },
      (error) => {
        console.log(error);
      }
    );

    this.tipoPromocionService
      .find({
        tprId: '0',
        tprActivo: 'all',
      })
      .subscribe((res) => {
        console.log('Res tipo promoción service');
        console.log(res);
        this.listTipoPromocion = res;
      });
  }
  onTipoPromocionChange(event: any) {
    this.filter.pmoTpr = event.value;
    this.search();
  }
  onSucursalChange(event: any) {
    this.filter.pmoSucId = event.value;
    this.search();
  }
  redirectToPromocionesObsequio(item: any) {
    console.log(item.pmoFechaFin); // "2022-01-01T00:00:00Z"

    // Obtener la fecha actual y establecerla al inicio del día (00:00:00)
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Convertir la fecha fin a objeto Date y establecerla al inicio del día (00:00:00)
    const fechaFin = new Date(item.pmoFechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    // Comparar si la fecha actual es menor que la fecha fin (comparación de días)
    const esFechaValida = fechaActual <= fechaFin;

    console.log(item);

    console.log('Fecha actual (00:00):', fechaActual.toISOString());
    console.log('Fecha fin (00:00):', fechaFin.toISOString());
    console.log('Es fecha válida (fecha actual < fecha fin):', esFechaValida);

    // Navegar con la bandera como parámetro de consulta
    this.router.navigate([`/promocion-obsequio/${item.pmoId}`], {
      queryParams: {
        fechaValida: esFechaValida,
        sucursalId: item.pmoSucId,
      },
    });
  }

  onNombreClick(item: any) {
    console.log('nombre click');
    console.log(item);
    // Obtener la fecha actual y establecerla al inicio del día (00:00:00)
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Convertir la fecha fin a objeto Date y establecerla al inicio del día (00:00:00)
    const fechaFin = new Date(item.pmoFechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    // Comparar si la fecha actual es menor que la fecha fin (comparación de días)
    const esFechaValida = fechaActual <= fechaFin;

    console.log(item);

    console.log('Fecha actual (00:00):', fechaActual.toISOString());
    console.log('Fecha fin (00:00):', fechaFin.toISOString());
    console.log('Es fecha válida (fecha actual < fecha fin):', esFechaValida);
    this.router.navigate([`/promocion-detalle/${item.pmoId}`], {
      queryParams: {
        tipoPromocion: item.pmoTprId,
        sucursalId: item.pmoSucId,
        fechaValida: esFechaValida,
      },
    });
  }
  /* Accesors */

  get promocionList(): Promocion[] {
    return this.promocionService.promocionList;
  }

  /* Métodos */

  add() {
    let newPromocion: Promocion = new Promocion();
    this.edit(newPromocion, false);
  }

  delete(promocion: Promocion): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        message: '¿Está seguro de eliminar la promoción?',
      },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.promocionService.delete(promocion).subscribe({
          next: (result) => {
            if (
              result.pmoId != undefined &&
              result.pmoId !== null &&
              result.pmoId > 0
            ) {
              this.toastr.success(
                'La promoción ha sido eliminada exitosamente',
                'Transacción exitosa'
              );
              this.promocionService.setIsUpdated(true);
            } else this.toastr.error('Ha ocurrido un error', 'Error');
          },
          error: (err) => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          },
        });
      }
    });
  }

  edit(ele: Promocion, isEditing:boolean = true) {
    this.dialog.open(PromocionEditComponent, {
      data: { promocion: JSON.parse(JSON.stringify(ele)),  isEditing: isEditing },
      height: '600px', 
      width: '800px', 
      maxWidth: 'none',
      disableClose: true,
     
    });
  }

  search(): void {

    this.promocionService.find(this.filter).subscribe((data)=>{
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    },
      (err)=>{
        console.log("Error al cargar datos", err);
        
      });

  }
}
