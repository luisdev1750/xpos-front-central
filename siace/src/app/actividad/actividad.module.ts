import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ApoyoModule } from "../apoyo/apoyo.module";
import { EvidenciaModule } from "../evidencia/evidencia.module";
import { NivelService } from "../nivel/nivel.service";
import { PilarService } from "../pilar/pilar.service";
import { ActividadEditComponent } from "./actividad-edit/actividad-edit.component";
import { ActividadListComponent } from "./actividad-list/actividad-list.component";
import { ActividadRoutingModule } from "./actividad.routing.module";
import { ActividadService } from "./actividad.service";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
	  MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    ActividadRoutingModule,
    EvidenciaModule,
    ApoyoModule,
    MatPaginatorModule

  ],
  declarations: [
    ActividadListComponent,
    ActividadEditComponent
  ],
  providers: [ActividadService, PilarService, NivelService],
  exports: [ ActividadListComponent ]
})
export class ActividadModule { }
