import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService } from '../role/role.service';
import { PermisoService } from './permiso.service';
import { PermisoListComponent } from './permiso-list/permiso-list.component';
import { PermisoRoutingModule } from './permiso.routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    PermisoRoutingModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  declarations: [
    PermisoListComponent
  ],
  providers: [EmprendedorService, RoleService, PermisoService],
  exports: []
})
export class PermisoModule { }


 
