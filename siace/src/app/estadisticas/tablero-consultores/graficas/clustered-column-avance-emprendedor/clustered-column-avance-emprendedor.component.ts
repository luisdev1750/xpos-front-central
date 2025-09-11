import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { PilarNivelCompletadoDTO } from '../../../../dto/dtoBusiness';
import { ApplicationUser } from '../../../../login/login.service';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';


@Component({
	selector: 'app-clustered-column-avance-emprendedor',
	templateUrl: './clustered-column-avance-emprendedor.component.html',
	styleUrls: ['./clustered-column-avance-emprendedor.component.css']
})
export class ClusteredColumnAvanceEmprendedorComponent implements OnInit, OnDestroy {
	private root!: am5.Root;

	constructor(
		private estadisticasDataService: EstadisticasDataService,
		private toastr: ToastrService,
		private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService
	) { }


	ngOnInit() {
		// Obtener el usuario de la sesión
		let user: ApplicationUser = JSON.parse(localStorage.getItem("user")!);

		// Obtener datos del servicio
		this.estadisticasDataService.PorcentajeCompletado_agrupado_pilar_nivel_por_emprendedor(user.empId)
			.subscribe((res) => {
				if (res && res.length > 0) {
					this.createChart(res);
				} else {
					this.toastr.warning('No hay datos para mostrar.', 'Advertencia');
				}
			}, error => {
				this.toastr.error('Error al obtener los datos.', 'Error');
			});
	}


	ngOnDestroy() {
		// Limpiar recursos de amCharts
		if (this.root) {
			this.root.dispose();
		}
	}


	/**
	 * Transforma los datos para el formato requerido por el gráfico
	 * @param rawData - Datos originales de los pilares y niveles completados
	 * @returns Array de objetos transformados para el gráfico
	 */
	transformData(rawData: PilarNivelCompletadoDTO[]): any[] {
		const dataMap: any = {};

		rawData.forEach(item => {
			if (!dataMap[item.pilDescripcion!]) {
				dataMap[item.pilDescripcion!] = {
					pilDescripcion: item.pilDescripcion,
					Emergente: 0,
					Desarrollado: 0,
					Optimizado: 0
				};
			}
			dataMap[item.pilDescripcion!][item.nivelDescripcion!] = item.porcentajeCompletado;
		});

		return Object.values(dataMap);
	}


	/**
	 * Crea el gráfico usando amCharts con los datos transformados
	 * @param rawData - Datos transformados para el gráfico
	 */
	createChart(rawData: PilarNivelCompletadoDTO[]) {
		this.root = am5.Root.new("chartCol");
		this.root._logo?.dispose();

		this.root.setThemes([
			am5themes_Animated.new(this.root)
		]);

		let chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
			panX: false,
			panY: false,
			paddingLeft: 0,
			wheelX: "panX",
			wheelY: "zoomX",
			layout: this.root.verticalLayout
		}));




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

		let legend = chart.children.push(
			am5.Legend.new(this.root, {
				centerX: am5.p50,
				x: am5.p50
			})
		);

		let data = this.transformData(rawData);

		let xRenderer = am5xy.AxisRendererX.new(this.root, {
			cellStartLocation: 0.1,
			cellEndLocation: 0.9,
			minorGridEnabled: true
		});

		let cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
		cursor.lineY.set("visible", false);

		let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(this.root, {
			categoryField: "pilDescripcion",
			renderer: xRenderer,
			tooltip: am5.Tooltip.new(this.root, {})
		}));

		xRenderer.labels.template.setAll({
			oversizedBehavior: "wrap",
			textAlign: "center"
		});



		xAxis.onPrivate("cellWidth", function (cellWidth) {
			xRenderer.labels.template.set("maxWidth", cellWidth);
		});

		xRenderer.grid.template.setAll({ location: 1 });
		xAxis.data.setAll(data);

		let yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(this.root, {
				renderer: am5xy.AxisRendererY.new(this.root, {
					strokeOpacity: 0.1
				}),
				min: 0,
				max: 100
			})
		);

		const makeSeries = (name: string, fieldName: string) => {
			let series = chart.series.push(am5xy.ColumnSeries.new(this.root, {
				name: name,
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: fieldName,
				categoryXField: "pilDescripcion"
			}));

			series.columns.template.setAll({
				tooltipText: "{name}: {valueY}%",
				width: am5.percent(90),
				tooltipY: 0,
				strokeOpacity: 0
			});

			series.data.setAll(data);

			series.appear();

			series.bullets.push(() => {
				return am5.Bullet.new(this.root, {
					locationY: 0,
					sprite: am5.Label.new(this.root, {
						text: "{valueY}%",
						fill: this.root.interfaceColors.get("alternativeText"),
						centerY: 0,
						centerX: am5.p50,
						populateText: true
					})
				});
			});

			legend.data.push(series);
		};

		makeSeries("Emergente", "Emergente");
		makeSeries("Desarrollado", "Desarrollado");
		makeSeries("Optimizado", "Optimizado");

		chart.appear(1000, 100);
	}
}