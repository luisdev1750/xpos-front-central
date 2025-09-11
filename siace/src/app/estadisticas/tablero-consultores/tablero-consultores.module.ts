import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TipoSesionService } from '../../tipo-sesion/tipo-sesion.service';
import { BuscadoresComponent } from './buscadores/buscadores.component';
import {
  ClusteredColumnAvanceEmprendedorComponent,
} from './graficas/clustered-column-avance-emprendedor/clustered-column-avance-emprendedor.component';
import {
  ColumnNumeroTiposSesionesComponent,
} from './graficas/column-numero-tipos-sesiones/column-numero-tipos-sesiones.component';
import {
  ColumnPromedioContestacionComponent,
} from './graficas/column-promedio-contestacion/column-promedio-contestacion.component';
import {
  HandlerClickComponent,
} from './graficas/handler-click/handler-click.component';
import {
  TableMatDialogComponent,
} from './graficas/handler-click/table-mat-dialog/table-mat-dialog.component';
import {
  PieEmprendedoresNivelComponent,
} from './graficas/pie-emprendedores-nivel/pie-emprendedores-nivel.component';
import {
  PieEntrevistasComponent,
} from './graficas/pie-entrevistas/pie-entrevistas.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import {
  TableroConsultoresComunicacionService,
} from './tablero-consultores-comunicacion.service';
import { TableroConsultoresComponent } from './tablero-consultores.component';


@NgModule({
  declarations: [
    TableroConsultoresComponent,
    IndicadoresComponent,
    BuscadoresComponent,
    ColumnPromedioContestacionComponent,
    ColumnNumeroTiposSesionesComponent,
    ClusteredColumnAvanceEmprendedorComponent,
    PieEntrevistasComponent,
    PieEmprendedoresNivelComponent,
    TableMatDialogComponent,
    HandlerClickComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,  // Alternativamente, puedes usar MatMomentDateModule si trabajas con Moment.js
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [
    TableroConsultoresComunicacionService,
    TipoSesionService
  ]
})
export class TableroConsultoresModule { }
