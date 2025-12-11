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
import { BancoService } from '../../banco/banco.service';

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
  displayedColumns = [
    'pmoNombre',
    'detallePromocion',
    'pmoFechaInicio',
    'pmoFechaFin',
    'pmoTprId',
    'pmoTpaId',
    'pmoSpaId',
    'pmoBanId', 
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

  // Clave para guardar el estado del paginador
  private readonly PAGINATOR_STATE_KEY = 'promocion_paginator_state';

  constructor(
    private promocionService: PromocionService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private sucursalService: SucursalService,
    private tipoPromocionService: TipoPromocionService,
    private tipoPagosService: TipoPagoService,
    private tipoSubpagoService: TipoSubpagoService,
    private router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private bancosService: BancoService
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
    
    // Restaurar el estado del paginador si existe
    this.restaurarEstadoPaginador();
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

  /**
   * Guarda el estado actual del paginador en sessionStorage
   */
  private guardarEstadoPaginador(): void {
    if (this.paginator) {
      const estado = {
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize
      };
      sessionStorage.setItem(this.PAGINATOR_STATE_KEY, JSON.stringify(estado));
    }
  }

  /**
   * Restaura el estado del paginador desde sessionStorage
   */
  private restaurarEstadoPaginador(): void {
    const estadoGuardado = sessionStorage.getItem(this.PAGINATOR_STATE_KEY);
    
    if (estadoGuardado && this.paginator) {
      try {
        const estado = JSON.parse(estadoGuardado);
        
        // Restaurar el tamaño de página primero
        if (estado.pageSize) {
          this.paginator.pageSize = estado.pageSize;
        }
        
        // Luego restaurar el índice de página
        if (estado.pageIndex !== undefined) {
          // Usar setTimeout para asegurar que la restauración ocurra después de que los datos estén cargados
          setTimeout(() => {
            this.paginator.pageIndex = estado.pageIndex;
          }, 0);
        }
        
        // Limpiar el estado guardado
        sessionStorage.removeItem(this.PAGINATOR_STATE_KEY);
      } catch (error) {
        console.error('Error al restaurar estado del paginador:', error);
      }
    }
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

     this.bancosService
      .find({
        banId: '0',
        banActivo: '',
      })
      .subscribe(
        (res) => {
          console.log('respuesta banco service');
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
    );

    this.tipoPromocionService
      .find({
        tprId: '0',
        tprActivo: 'true',
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
    console.log(item.pmoFechaFin);

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaFin = new Date(item.pmoFechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    const esFechaValida = fechaActual <= fechaFin;

    console.log(item);
    console.log('Fecha actual (00:00):', fechaActual.toISOString());
    console.log('Fecha fin (00:00):', fechaFin.toISOString());
    console.log('Es fecha válida (fecha actual < fecha fin):', esFechaValida);

    // Guardar estado del paginador antes de navegar
    this.guardarEstadoPaginador();

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
    if (!this.esPromocionActiva(item)) {
      this.toastr.warning(
        'Esta promoción ya no está vigente',
        'Promoción vencida'
      );
      return;
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaFin = new Date(item.pmoFechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    const esFechaValida = fechaActual <= fechaFin;

    console.log(item);
    console.log('Fecha actual (00:00):', fechaActual.toISOString());
    console.log('Fecha fin (00:00):', fechaFin.toISOString());
    console.log('Es fecha válida (fecha actual < fecha fin):', esFechaValida);
    
    // Guardar estado del paginador antes de navegar
    this.guardarEstadoPaginador();
    
    this.router.navigate([`/promocion-detalle/${item.pmoId}`], {
      queryParams: {
        tipoPromocion: item.pmoTprId,
        sucursalId: item.pmoSucId,
        fechaValida: esFechaValida,
      },
    });
  }

  get promocionList(): Promocion[] {
    return this.promocionService.promocionList;
  }

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

  edit(ele: Promocion, isEditing: boolean = true) {
    this.dialog.open(PromocionEditComponent, {
      data: {
        promocion: JSON.parse(JSON.stringify(ele)),
        isEditing: isEditing,
      },
      height: '600px',
      width: '800px',
      maxWidth: 'none',
      disableClose: true,
    });
  }

  search(): void {
    this.promocionService.find(this.filter).subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.log('Error al cargar datos', err);
      }
    );
  }

  esPromocionActiva(item: Promocion): boolean {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaFin = new Date(item.pmoFechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    return fechaActual <= fechaFin;
  }

  extraerDetallePromocion(nombrePromocion: string): string {
    if (!nombrePromocion) {
      return '';
    }

    const regexPorcentaje = /-?(\d+(?:\.\d+)?)\s*%/i;
    const matchPorcentaje = nombrePromocion.match(regexPorcentaje);

    if (matchPorcentaje) {
      const numero = Math.abs(parseFloat(matchPorcentaje[1]));
      return `${numero}%`;
    }

    const regexNxM = /(\d+)\s*x\s*(\d+)/i;
    const matchNxM = nombrePromocion.match(regexNxM);

    if (matchNxM) {
      return `${matchNxM[1]}x${matchNxM[2]}`;
    }

    return '';
  }
}