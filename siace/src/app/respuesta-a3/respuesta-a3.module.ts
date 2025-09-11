import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ActividadService } from '../actividad/actividad.service';
import { ApoyoModule } from '../apoyo/apoyo.module';
import { GeneralService } from '../common/general.service';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { NivelService } from '../nivel/nivel.service';
import { PilarService } from '../pilar/pilar.service';
import { A3EditComponent } from './a3-edit/a3-edit.component';
import { A3ListComponent } from './a3-list/a3-list.component';
import { RespuestaA3RoutingModule } from './respuesta-a3-routing.module';
import { RespuestaA3Component } from './respuesta-a3.component';
import { RespuestaA3Service } from './respuesta-a3.service';


@NgModule({
  declarations: [
    RespuestaA3Component,
    A3EditComponent,
    A3ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    RespuestaA3RoutingModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatTabsModule,
    MatBadgeModule,
    ApoyoModule
  ],
  exports: [
    RespuestaA3Component,
    A3EditComponent,
    A3ListComponent
  ],
  providers:[
    PilarService, EmprendedorService, RespuestaA3Service, ActividadService, NivelService, GeneralService
  ]
})
export class RespuestaA3Module { }
