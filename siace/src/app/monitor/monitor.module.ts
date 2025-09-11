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
import {
  CuestionarioRoutingModule,
} from '../cuestionario/cuestionario-routing.module';
import { CuestionarioService } from '../cuestionario/cuestionario.service';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import {
  ConfirmacionModule,
} from '../encuestas/confirmacion/confirmacion.module';
import { ObjetivoService } from '../objetivo/objetivo.service';
import { SesionObjetivoService } from '../sesion/sesion-objetivo.service';
import { SesionService } from '../sesion/sesion.service';
import { TipoSesionService } from '../tipo-sesion/tipo-sesion.service';
import { BuscarContestacionesComponent } from './monitor.component';
import { BuscarContestacionesService } from './monitor.component.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    declarations: [
        // PreguntasListComponent,
        // ResultsComponent,
        BuscarContestacionesComponent,
        // FormularioPrevioCuestionarioComponent
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
        ConfirmacionModule,
        MatAutocompleteModule,
        MatTooltipModule,
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
        BuscarContestacionesComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MonitorModule{}