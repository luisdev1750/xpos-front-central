import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { SesionListComponent } from './sesion-list/sesion-list.component';
import { SesionEditComponent } from './sesion-edit/sesion-edit.component';
import { SesionService } from './sesion.service';
import { SesionRoutingModule } from './sesion.routing.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ObjetivoService } from '../objetivo/objetivo.service';

import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionModule } from '@angular/material/expansion';
//import { SesionAddObjectiveComponent } from './sesion-add-objective/sesion-add-objective.component';
import { SesionObjetivoService } from './sesion-objetivo.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
// Otros módulos


// Importa estos módulos adicionales que faltan:
import { MatOptionModule } from '@angular/material/core';
import { MatLabel } from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
	  MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    SesionRoutingModule,
    MatTabsModule,
    MatAccordion,
    MatExpansionModule,
    MaterialFileInputModule,
   MatOptionModule, // Para mat-option
    
    // Otros módulos
    NgxMaterialTimepickerModule,
    MaterialFileInputModule
  ],
  declarations: [
    SesionListComponent,
    SesionEditComponent,
    //SesionAddObjectiveComponent
  ],
  providers: [SesionService, EmprendedorService, ObjetivoService, SesionObjetivoService],
  exports: [SesionEditComponent]
})
export class SesionModule { }
