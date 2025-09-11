import {
  CommonModule,
  registerLocaleData,
} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EmprendedorService } from '../emprendedor/emprendedor.service';
import { SesionModule } from '../sesion/sesion.module';
import { SesionService } from '../sesion/sesion.service';
import { TipoSesionService } from '../tipo-sesion/tipo-sesion.service';
import {
  CalendarEventComponent,
} from './calendar-event/calendar-event.component';
import { CalendarioComponent } from './calendario.component';
import { CalendarioRoutingModule } from './calendario.routing';


registerLocaleData(localeEs);

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      CalendarModule.forRoot({
         provide: DateAdapter,
         useFactory: adapterFactory,
      }),
      MatListModule,
      MatSnackBarModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatIconModule,
      MatCheckboxModule,
      MatDialogModule,
      MatPaginatorModule,
      MatAutocompleteModule,
      CalendarioRoutingModule,
      MatTooltipModule,
      SesionModule,
      FormsModule,
      ReactiveFormsModule,
   ],
   declarations: [
      CalendarioComponent,
      CalendarEventComponent
   ],
   /*entryComponents: [
   ],*/
   providers: [SesionService,
      TipoSesionService,
      EmprendedorService,
      { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },]
      //{ provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }],
})
export class CalendarioModule { }
