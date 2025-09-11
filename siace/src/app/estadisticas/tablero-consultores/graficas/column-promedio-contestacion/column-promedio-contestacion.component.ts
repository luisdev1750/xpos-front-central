import {
  AfterViewChecked,
  ChangeDetectorRef,
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
import { DiagnosticoPromedio } from '../../../../dto/dtoBusiness';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';


@Component({
	selector: 'app-column-promedio-contestacion',
	templateUrl: './column-promedio-contestacion.component.html',
	styleUrls: ['./column-promedio-contestacion.component.css'],
})
export class ColumnPromedioContestacionComponent implements OnInit, OnDestroy, AfterViewChecked {
	title = "Diagnóstico Promedio";
	containerID = "columnPromedioContestacion";
	titleSize = 16;
	private root!: am5.Root;
	readonly INTEVALS_COLUMN = 10;
	private intervalLabelGenerated!: string[];
	private countForInterval!: number[];
	private simulatedData: DiagnosticoPromedio[] = [];
	public showChart: boolean = false;
	private chartInitialized = false;
	private destroy$ = new Subject<void>();

	constructor(
		private estadisticasDataService: EstadisticasDataService,
		private toastr: ToastrService,
		private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService,
		private cdr: ChangeDetectorRef // Para forzar la detección de cambios
	) { }

	ngOnInit(): void {
		this.tableroConsultoresComunicacionService.buscadorData$
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.intervalLabelGenerated = [];
				this.countForInterval = [];
				this.getDataFromDatabase(res.fechaIni, res.fechaFin).then(() => {
					this.generateRangesLabels();
					this.processData();
					this.showChart = true;
					this.chartInitialized = false; // Resetea el estado para recrear el gráfico
					this.cdr.detectChanges(); // Forzar la detección de cambios
				});
			});
	}

	ngAfterViewChecked(): void {
		if (this.showChart && !this.chartInitialized) {
			this.updateChart(); // Dispone y crea el gráfico correctamente
			this.chartInitialized = true;
		}
	}

	ngOnDestroy(): void {
		if (this.root) {
			this.root.dispose();
		}
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Actualiza el gráfico o lo crea si aún no existe.
	 */
	private updateChart(): void {
		if (this.root) {
			this.root.dispose(); // Dispone del gráfico anterior antes de crear uno nuevo
		}
		this.createChart();
	}

	/**
	 * Crea el gráfico de columnas con los datos procesados.
	 */
	private createChart(): void {
		this.root = am5.Root.new(this.containerID);
		this.root._logo?.dispose();
		this.root.setThemes([am5themes_Animated.new(this.root)]);

		let chart = this.root.container.children.push(
			am5xy.XYChart.new(this.root, {
				panX: true,
				panY: true,
				layout: am5.GridLayout.new(this.root, {}),
				wheelX: "panX",
				wheelY: "zoomX",
				pinchZoomX: true,
			})
		);

		chart.get("colors")!.set("colors", [
			am5.color(0xB54828),
			am5.color(0xB98168),
			am5.color(0x947E73),
			am5.color(0xe3dad3),
		]);

		/*ayuda del zoom*/
		let zoomToolTip = am5.Tooltip.new(this.root, {})
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
			rotation: -90,
			centerY: am5.p50,
			centerX: am5.p100,
			paddingRight: 15,
		});

		let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
		cursor.lineY.set("visible", false);

		let xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(this.root, {
				maxDeviation: 0.3,
				categoryField: "country",
				renderer: xRenderer,
				tooltip: am5.Tooltip.new(this.root, {}),
			})
		);

		let yRenderer = am5xy.AxisRendererY.new(this.root, { strokeOpacity: 0.1 });
		let yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(this.root, { maxDeviation: 0.3, renderer: yRenderer })
		);

		let series = chart.series.push(
			am5xy.ColumnSeries.new(this.root, {
				name: "Series 1",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "value",
				categoryXField: "country",
				tooltip: am5.Tooltip.new(this.root, {
					labelText: "{valueY} Emprendedores",
				}),
			})
		);

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

		const chartData = this.intervalLabelGenerated.map((label, index) => {
			return { country: label, value: this.countForInterval[index] };
		});

		xAxis.data.setAll(chartData);
		series.data.setAll(chartData);

		chart.children.unshift(
			am5.Label.new(this.root, {
				text: `${this.title}`,
				maxWidth: 100,
				fontSize: 16,
				marginBottom: 10,
				fontWeight: "500",
				textAlign: "center",
				x: am5.percent(50),
				centerX: am5.percent(50),
				paddingTop: 0,
				paddingBottom: 0,
			})
		);

		series.columns.template.events.on("click", (ev) => {
			const dataItem = ev.target.dataItem;
			if (dataItem) {
				let categoria = dataItem.dataContext as any;
				this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
					titleGraphic: this.title,
					titleCategory: categoria.country,
				});
			}
		});

		series.appear(1000);
		chart.appear(1000, 100);
	}

	/**
	 * Genera las etiquetas de los rangos para el gráfico.
	 */
	private generateRangesLabels(): void {
		for (let i = 0; i < 100; i += this.INTEVALS_COLUMN) {
			this.intervalLabelGenerated.push(`${i}-${i + this.INTEVALS_COLUMN}`);
		}
		this.countForInterval = new Array(this.intervalLabelGenerated.length).fill(0);
	}

	/**
	 * Obtiene los datos de la base de datos según las fechas proporcionadas.
	 * @param fechaIni Fecha de inicio del rango.
	 * @param fechaFin Fecha de fin del rango.
	 */
	private getDataFromDatabase(fechaIni: string, fechaFin: string): Promise<void> {
		return new Promise((resolve, reject) => {
			let observer = this.estadisticasDataService.getDiagnosticoPromedioPorRangoDeFechas(
				fechaIni,
				fechaFin
			);
			observer.subscribe({
				next: (res: any) => {
					this.simulatedData = res && res.length > 0 ? res : [];
					resolve();
				},
				error: (error: any) => {
					this.toastr.error('Error al obtener datos de la base de datos.', 'Error');
					this.simulatedData = [];
					reject(error);
				},
			});
		});
	}

	/**
	 * Procesa los datos simulados para ajustar los valores al gráfico.
	 */
	private processData(): void {
		this.tableroConsultoresComunicacionService.indicador_DiagnosticoSubject.next(this.simulatedData.length);
		this.simulatedData.forEach((item) => {
			const promedio = item.conPromedio;
			if (promedio !== null && promedio! >= 0) {
				const index = Math.floor(promedio! / this.INTEVALS_COLUMN);
				if (index < this.countForInterval.length) {
					this.countForInterval[index]++;
				}
			}
		});
	}
}
