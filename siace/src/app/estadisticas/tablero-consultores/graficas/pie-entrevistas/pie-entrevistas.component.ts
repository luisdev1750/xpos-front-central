import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { EmprendedoresSesionDto } from '../../../../dto/dtoBusiness';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';


@Component({
    selector: 'app-pie-entrevistas',
    templateUrl: './pie-entrevistas.component.html',
    styleUrls: ['./pie-entrevistas.component.css']
  })
  export class PieEntrevistasComponent implements OnInit, OnDestroy {
    title = "Entrevistas";
    titleFontSize = 16;
    totalElementos = 0;
    private root!: am5.Root;
    private pieData: { value: number, category: string }[] = [];
    public showChart: boolean = false;
    private chartInitialized = false;

    constructor(
      private estadisticasDataService: EstadisticasDataService,
      private toastr: ToastrService,
      private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService
    ) { }

    ngOnInit(): void {
      this.tableroConsultoresComunicacionService.buscadorData$.subscribe(async (res) => {
        if (res.fechaIni !== '') {
          this.showChart = false;
          this.disposeChart();

          try {
            await this.getDataFromDatabase(res.fechaIni, res.fechaFin);
            this.showChart = true;
          } catch (error) {
            console.error("Error al cargar los datos filtrados:", error);
          }
        }
      });
    }

    ngAfterViewChecked(): void {
      if (this.showChart && !this.chartInitialized) {
        this.disposeChart();
        this.createChart();
        this.chartInitialized = true;
      }
    }

    ngOnDestroy(): void {
      this.disposeChart();
    }

    /* Metodos */

    /**
     * Crea y configura el gráfico de pastel usando amCharts.
     */
    private createChart(): void {
      this.root = am5.Root.new("pieEntrevistas");
      this.root._logo?.dispose();
      this.root.autoResize = true;
      this.root.fps = 60;

      // Aplicar el tema animado
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      am5plugins_exporting.Exporting.new(this.root, {
        title: this.title,
      });

      // Crear el gráfico de torta
      let chart = this.root.container.children.push(am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout,
      }));




      // Crear la serie
      let series = chart.series.push(am5percent.PieSeries.new(this.root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false
      }));


      series.get("colors")!.set("colors", [
        am5.color(0xB54828),
        am5.color(0xB98168),
        am5.color(0x947E73),
        am5.color(0xe3dad3),
      ]);

      // Ocultar etiquetas
      series.labels.template.set('forceHidden', true);

      series.slices.template.events.on('click', ev => {
        const categoriaClick = (ev.target.dataItem?.dataContext as any).category;
        this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
          titleGraphic: this.title,
          titleCategory: categoriaClick
        });
      });

      // Configurar los datos en la serie
      series.data.setAll(this.pieData);

      // Crear la leyenda y posicionarla correctamente
      let legend = chart.children.push(am5.Legend.new(this.root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: am5.GridLayout.new(this.root, {
          maxColumns: 1,
          fixedWidthGrid: true
        }),
        clickTarget: "none"
      }));

      legend.itemContainers.template.events.on("click", (ev) => {
        let seriesColumn = (ev.target.dataItem?.dataContext as any).dataContext;
        let categoria = seriesColumn.category;

        this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
          titleGraphic: this.title,
          titleCategory: categoria
        });
      });

      // Vincula la leyenda con los elementos de la serie
      legend.data.setAll(series.dataItems);

      // Añadir un título
      chart.children.unshift(am5.Label.new(this.root, {
        text: `${this.title}`,
        fontSize: this.titleFontSize,
        marginTop: 12,
        fontWeight: "500",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0
      }));

      // Configurar el tooltip
      let tooltip = am5.Tooltip.new(this.root, {
        getFillFromSprite: false,
        getStrokeFromSprite: true,
        autoTextColor: false,
        getLabelFillFromSprite: true,
        labelText: "[bold]{category}[/]\n{value} Entrevistas"
      });

      tooltip.get("background")!.setAll({
        fill: am5.color(0xffffff),
        fillOpacity: 0.8
      });

      // Asignar el tooltip a la serie
      series.set("tooltip", tooltip);

      // Animación inicial de la serie
      series.appear(1000, 100);
    }

    /**
     * Elimina el gráfico si está inicializado.
     */
    private disposeChart(): void {
      if (this.root) {
        this.root.dispose();
        this.root = undefined!;
        this.chartInitialized = false;
      }
    }

    /**
     * Obtiene los datos reales del backend.
     * @param fechaIni Fecha de inicio del rango
     * @param fechaFin Fecha de fin del rango
     * @param empID ID del empresario (opcional)
     */
    private getDataFromDatabase(fechaIni?: string, fechaFin?: string): Promise<void> {
      return new Promise((resolve, reject) => {
        let observable;

        let tipoSesionEntrevista_id=1;

        if (fechaIni && fechaFin) {
          observable = this.estadisticasDataService.contarEmprendedoresConYSinSesionPorRangoDeFechas(tipoSesionEntrevista_id, fechaIni, fechaFin);
        } 

        observable!.subscribe({
          next: (data: EmprendedoresSesionDto) => {
            if (data) {
              this.pieData = [
                { value: data.agendado!, category: "Atendidos" },
                { value: data.pendiente!, category: "Pedientes" }
              ];

              this.totalElementos = data.agendado! + data.pendiente!;
              this.tableroConsultoresComunicacionService.indicador_EntrevistasSubject.next(this.totalElementos);
              resolve();
            } else {
              this.pieData = [];
              resolve();
            }
          },
          error: (error: any) => {
            this.toastr.error('Error al obtener datos de la base de datos.', 'Error');
            this.pieData = [];
            reject(error);
          }
        });
      });
    }
  }
