import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { TasaCuotaListComponent } from './tasa-cuota-list/tasa-cuota-list.component';
import { TasaCuotaEditComponent } from './tasa-cuota-edit/tasa-cuota-edit.component';
import { TasaCuotaService } from './tasa-cuota.service';
import { TasaCuotaRoutingModule } from './tasa-cuota.routing.module';
import { MatSelectModule } from '@angular/material/select';

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
    MatCardModule,
    TasaCuotaRoutingModule,
        MatSelectModule,
        MatOptionModule
  ],
  declarations: [
    TasaCuotaListComponent,
    TasaCuotaEditComponent
  ],
  providers: [TasaCuotaService],
  exports: []
})
export class TasaCuotaModule { }
