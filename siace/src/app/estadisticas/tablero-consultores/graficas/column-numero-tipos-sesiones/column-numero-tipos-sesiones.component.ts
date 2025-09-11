import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { TiposSesionesDto } from '../../../../dto/dtoBusiness';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';


@Component({
  selector: 'app-column-numero-tipos-sesiones',
  templateUrl: './column-numero-tipos-sesiones.component.html',
  styleUrls: ['./column-numero-tipos-sesiones.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnNumeroTiposSesionesComponent implements OnInit, OnDestroy {
  title = "Número de Sesiones";
  containerID = "chartColumnNumeroTiposSesiones";
  titleSize = 16;
  private root!: am5.Root;
  private dataTiposSesiones: TiposSesionesDto[] = [];
  public showChart: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private estadisticasDataService: EstadisticasDataService,
    private toastr: ToastrService,
    private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService
  ) { }

  ngOnInit(): void {
    this.tableroConsultoresComunicacionService.buscadorData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataTiposSesiones = [];
        this.getDataFromDatabase(res.fechaIni, res.fechaFin).then(() => {
          this.updateChart();
        });
      });
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza la gráfica o la crea si aún no existe.
   */
  private updateChart(): void {
    if (this.root) {
      this.root.dispose(); // Elimina la gráfica anterior antes de crear una nueva
    }
    this.createChart();
  }

  /**
   * Crea y configura el gráfico de columnas usando amCharts.
   */
  private createChart(): void {
    this.root = am5.Root.new(this.containerID);
    this.root._logo?.dispose();
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
      panX: true,
      panY: true,
      layout: am5.GridLayout.new(this.root, {}),
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    }));

    chart.get("colors")!.set("colors", [
      am5.color(0xB54828),
      am5.color(0xB98168),
      am5.color(0x947E73),
      am5.color(0xe3dad3),
     ]);

    /*ayuda del zoom*/
	 let zoomToolTip=am5.Tooltip.new(this.root, {})
	 zoomToolTip.get("background")!.setAll({
		fill: am5.color(0xB98168),
		
		fillOpacity: 0.5
	 });

	 chart.zoomOutButton.setAll({
		tooltipText: "restaurar escala",
		tooltip: zoomToolTip
	 });

    this.root.autoResize = true;
    this.root.fps = 45;

    let xRenderer = am5xy.AxisRendererX.new(this.root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 5,
      fontSize: this.titleSize - 8,
      oversizedBehavior: "wrap",
      maxWidth: 80,
      textAlign: "end",
      
    });

    let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set("visible", false);

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
      maxDeviation: 0.3,
      categoryField: "tisNombre",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(this.root, {}),
    }));

    let yRenderer = am5xy.AxisRendererY.new(this.root, { strokeOpacity: 0.1 });
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(this.root, { maxDeviation: 0.3, renderer: yRenderer }));

    let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "numeroSesiones",
      categoryXField: "tisNombre",
      tooltip: am5.Tooltip.new(this.root, {
        labelText: "{valueY} Sesiones",
      }),
    }));

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
    });

    chart.set("scrollbarX", am5.Scrollbar.new(this.root, { orientation: "horizontal" }));

    series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(this.dataTiposSesiones);
    series.data.setAll(this.dataTiposSesiones);

    chart.children.unshift(am5.Label.new(this.root, {
      text: `${this.title}`,
      maxWidth: 100,
      fontSize: this.titleSize,
      marginBottom: 10,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0,
    }));

    series.columns.template.events.on("click", (ev) => {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        let categoria = dataItem.dataContext as any;
        this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
          titleGraphic: this.title,
          titleCategory: categoria.tisId.toString(),
        });
      }
    });

    series.appear(1000);
    chart.appear(1000, 100);
  }

  /**
   * Obtiene los datos de tipos de sesiones desde el servicio correspondiente.
   * @param fechaIni Fecha de inicio del rango
   * @param fechaFin Fecha de fin del rango
   */
  private getDataFromDatabase(fechaIni: string, fechaFin: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let observable = this.estadisticasDataService.numeroTiposSesionesPorTodosEmprendedoresConFechas(fechaIni, fechaFin);

      observable.subscribe({
        next: (res: TiposSesionesDto[]) => {
          this.dataTiposSesiones = res && res.length > 0 ? res : [];
          this.processData(res);
          resolve();
        },
        error: (error: any) => {
          this.toastr.error('Error al obtener datos de la base de datos.', 'Error');
          this.dataTiposSesiones = [];
          reject(error);
        },
      });
    });
  }

  /**
   * Procesa los datos recibidos y calcula el total de sesiones.
   * @param reciveData Datos recibidos de las sesiones
   * @returns El número total de sesiones
   */
  private processData(reciveData: TiposSesionesDto[]): number {
    let contadorTotal = 0;
    reciveData.forEach((element) => {
      contadorTotal += element.numeroSesiones!;
    });
    this.tableroConsultoresComunicacionService.indicador_DevifaciSubject.next(contadorTotal);
    return contadorTotal;
  }
}
