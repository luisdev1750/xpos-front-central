import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import {
  BuscarContestacionesService,
} from '../monitor/monitor.component.service';
import { ObjetivoService } from '../objetivo/objetivo.service';
import { SesionObjetivoService } from '../sesion/sesion-objetivo.service';
import { SesionService } from '../sesion/sesion.service';
import { TipoSesionService } from '../tipo-sesion/tipo-sesion.service';
import { CuestionarioRoutingModule } from './cuestionario-routing.module';
import { CuestionarioService } from './cuestionario.service';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import {
  PreguntasListComponent,
} from './preguntas-list/preguntas-list.component';
import { ResultsComponent } from './results/results.component';


@NgModule({
  declarations: [
    PreguntasListComponent,
    ResultsComponent,
    NavLogoComponent,

  ],
  imports: [
    CommonModule,
    CuestionarioRoutingModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCardModule,
    ToastrModule,
    MatInputModule,
    MatDateRangePicker,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  providers: [
    CuestionarioService,
    BuscarContestacionesService,
    EmprendedorService, 
    SesionService,
    ObjetivoService,
    SesionObjetivoService,
    TipoSesionService
  ],
  exports: [
    PreguntasListComponent,
    ResultsComponent,
    NavLogoComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CuestionarioModule { }
