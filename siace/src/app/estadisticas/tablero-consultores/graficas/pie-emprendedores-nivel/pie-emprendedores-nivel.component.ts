import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import * as am5plugins_exporting from '@amcharts/amcharts5/plugins/exporting';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { NumeroEmprendedoresPorNivelDto } from '../../../../dto/dtoBusiness';
import { EstadisticasDataService } from '../../../estadisticas-data.service';
import {
  TableroConsultoresComunicacionService,
} from '../../tablero-consultores-comunicacion.service';


@Component({
   selector: 'app-pie-emprendedores-nivel',
   templateUrl: './pie-emprendedores-nivel.component.html',
   styleUrls: ['./pie-emprendedores-nivel.component.css'],
 })
 export class PieEmprendedoresNivelComponent implements OnInit, OnDestroy, AfterViewChecked {
   title = "Empresas por Nivel";
   private root!: am5.Root;
   private pieData: { category: string, value: number }[] = [];
   private categorias: string[] = [];
   public showChart: boolean = false;
   private chartInitialized = false;
 
   constructor(
     private estadisticasDataService: EstadisticasDataService,
     private toastr: ToastrService,
     private tableroConsultoresComunicacionService: TableroConsultoresComunicacionService
   ) {}
 
   ngOnInit(): void {
     this.tableroConsultoresComunicacionService.buscadorData$.subscribe(async (res) => {
       if (res.fechaIni) {
         this.showChart = false;
         this.disposeChart();
         try {
           await this.getDataFromDatabase(res.fechaIni, res.fechaFin);
           this.showChart = true;
         } catch (error) {
           this.toastr.error('Error al cargar los datos.', 'Error');
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
 
   private createChart(): void {
     this.root = am5.Root.new("pieEmprendedoresNivel");
     this.root._logo?.dispose();
     this.root.autoResize = true;
 
     this.root.setThemes([am5themes_Animated.new(this.root)]);
 
     am5plugins_exporting.Exporting.new(this.root, {
       title: this.title,
     });
 
     let chart = this.root.container.children.push(
       am5percent.PieChart.new(this.root, {
         layout: this.root.verticalLayout,
       })
     );
 
     let series = chart.series.push(
       am5percent.PieSeries.new(this.root, {
         valueField: "value",
         categoryField: "category",
         alignLabels: false
       })
     );
 
     series.get("colors")!.set("colors", [
       am5.color(0xB54828),
       am5.color(0xB98168),
       am5.color(0x947E73),
       am5.color(0xe3dad3),
     ]);
 
     series.labels.template.set('forceHidden', true);
 
     series.slices.template.events.on('click', ev => {
       const categoriaClick = (ev.target.dataItem?.dataContext as any).category as string;
       const indice = this.categorias.indexOf(categoriaClick);
       this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
         titleGraphic: this.title,
         titleCategory: indice.toString()
       });
     });
 
     series.data.setAll(this.pieData);
 
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
       let indice = this.categorias.indexOf(categoria);
 
       this.tableroConsultoresComunicacionService.clickEventGraphicData$.next({
         titleGraphic: this.title,
         titleCategory: indice.toString()
       });
     });
 
     legend.data.setAll(series.dataItems);
 
     chart.children.unshift(am5.Label.new(this.root, {
       text: `${this.title}`,
       fontSize: 16,
       marginTop: 12,
       fontWeight: "500",
       textAlign: "center",
       x: am5.percent(50),
       centerX: am5.percent(50),
       paddingTop: 0,
       paddingBottom: 0
     }));
 
     let tooltip = am5.Tooltip.new(this.root, {
       getFillFromSprite: false,
       getStrokeFromSprite: true,
       autoTextColor: false,
       getLabelFillFromSprite: true,
       labelText: "[bold]{category}[/]\n{value} Empresas",
     });
     tooltip.get("background")!.setAll({
       fill: am5.color(0xffffff),
       fillOpacity: 0.8
     });
     series.set("tooltip", tooltip);
 
     series.appear(1000, 100);
   }
 
   private disposeChart(): void {
     if (this.root) {
       this.root.dispose();
       this.root = undefined!;
       this.chartInitialized = false;
     }
   }
 
   private getDataFromDatabase(fechaIni: string, fechaFin: string): Promise<void> {
     return new Promise((resolve, reject) => {
       this.estadisticasDataService.numeroEmprendedoresPorNivel(fechaIni, fechaFin).subscribe({
         next: (data: NumeroEmprendedoresPorNivelDto[]) => {
            console.log(data);
           this.pieData = data.map(nivel => ({
             category: nivel.nivelDescripcion!,
             value: nivel.numeroEmprendedores!
           }));
           this.categorias = data.map(nivel => nivel.nivelDescripcion!);
 
           const totalEmpresas = data.reduce((acc, nivel) => acc + nivel.numeroEmprendedores!, 0);
           this.tableroConsultoresComunicacionService.indicador_A3Subject.next(totalEmpresas);
           resolve();
         },
         error: (error: any) => {
           this.toastr.error('Error al obtener datos de la base de datos.', 'Error');
           reject(error);
         }
       });
     });
   }
 }
 