import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComunicationDashboardService } from './comunication-dashboard.service';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import {
  TableroConsultoresModule,
} from './tablero-consultores/tablero-consultores.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatNativeDateModule,
    TableroConsultoresModule,
    EstadisticasRoutingModule
  ],
  providers: [
    ComunicationDashboardService
  ],
})
export class EstadisticasModule { }
