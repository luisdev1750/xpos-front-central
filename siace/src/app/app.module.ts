import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import localeMx from '@angular/common/locales/es-MX';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './auth/jwt.interceptor';
import {
  ConfirmDialogComponent,
} from './common/confirm-dialog/confirm-dialog.component';
import {
  LoadingDialogComponent,
} from './common/loading-dialog/loading-dialog.component';
import {
  LoadingDialogService,
} from './common/loading-dialog/loading-dialog.service';
import {
  BuscarContestacionesService,
} from './monitor/monitor.component.service';
import { CuestionarioService } from './cuestionario/cuestionario.service';
import {
  EstadisticasDataService,
} from './estadisticas/estadisticas-data.service';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { ModuloService } from './modulo/modulo.service';
import { SigaNavComponent } from './nav/nav.component';
import {
  SigaNavigationBarComponent,
} from './navigation-bar/navigation-bar.component';
import { NivelEstudioService } from './nivel-estudio/nivel-estudio.service';
import { GiroService } from './giro/giro.service';
import { NecesidadService } from './necesidad/necesidad.service';
import { MenuModule } from './menu/menu.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WelcomeComponent } from './welcome/welcome.component';


registerLocaleData(localeMx);

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    LoginComponent,
    LoadingDialogComponent,
    SigaNavComponent,
    SigaNavigationBarComponent,
    WelcomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatStepperModule,
    FlexLayoutModule,
    EstadisticasModule,
     MatTooltipModule,
    ToastrModule.forRoot({
      //timeOut: 10000,
      //positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    MenuModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    LoadingDialogService,
    LoginService,
    ModuloService,
    BuscarContestacionesService,
    CuestionarioService,
    BuscarContestacionesService,
    EstadisticasDataService,
    NivelEstudioService,
    GiroService, 
    NecesidadService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
