import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { PromocionObsequioListComponent } from './promocion-obsequio-list/promocion-obsequio-list.component';
import { PromocionObsequioEditComponent } from './promocion-obsequio-edit/promocion-obsequio-edit.component';
import { PromocionObsequioService } from './promocion-obsequio.service';
import { PromocionObsequioRoutingModule } from './promocion-obsequio.routing.module';

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
    PromocionObsequioRoutingModule,
  ],
  declarations: [
    PromocionObsequioListComponent,
    PromocionObsequioEditComponent
  ],
  providers: [PromocionObsequioService],
  exports: []
})
export class PromocionObsequioModule { }
