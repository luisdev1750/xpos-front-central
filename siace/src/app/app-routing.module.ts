import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  //{path:'', redirectTo: '\login', pathMatch: 'full'},
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then(
            (m) => m.EstadisticasModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'banco',
        loadChildren: () =>
          import('./banco/banco.module').then((m) => m.BancoModule),
      },
      {
        path: 'sucursal',
        loadChildren: () =>
          import('./sucursal/sucursal.module').then((m) => m.SucursalModule),
      },
      {
        path: 'marca',
        loadChildren: () =>
          import('./marca/marca.module').then((m) => m.MarcaModule),
      },
      {
        path: 'familia',
        loadChildren: () =>
          import('./familia/familia.module').then((m) => m.FamiliaModule),
      },
      {
        path: 'sucursal-configuracion',
        loadChildren: () =>
          import('./sucursal-config/sucursal-config.module').then(
            (m) => m.SucursalConfigModule
          ),
      },
      {
        path: 'submarca',
        loadChildren: () =>
          import('./submarca/submarca.module').then((m) => m.SubmarcaModule),
      },
      {
        path: 'presentacion',
        loadChildren: () =>
          import('./presentacion/presentacion.module').then(
            (m) => m.PresentacionModule
          ),
      },
      {
        path: 'lista-precio',
        loadChildren: () =>
          import('./lista-precio/lista-precio.module').then(
            (m) => m.ListaPrecioModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then((m) => m.PerfilModule),
      },
      {
        path: 'usuario',
        loadChildren: () =>
          import('./usuario/usuario.module').then((m) => m.UsuarioModule),
      },
      {
        path: 'tasa-cuota',
        loadChildren: () =>
          import('./tasa-cuota/tasa-cuota.module').then(
            (m) => m.TasaCuotaModule
          ),
      },
      {
        path: 'tipo-promocion',
        loadChildren: () =>
          import('./tipo-promocion/tipo-promocion.module').then(
            (m) => m.TipoPromocionModule
          ),
      },
      {
        path: 'producto',
        loadChildren: () =>
          import('./producto/producto.module').then((m) => m.ProductoModule),
      },
      {
        path: 'promocion-detalle',
        loadChildren: () =>
          import('./promocion-detalle/promocion-detalle.module').then(
            (m) => m.PromocionDetalleModule
          ),
      },
      {
        path: 'sucursal-prod-stock',
        loadChildren: () =>
          import('./sucursal-prod-stock/sucursal-prod-stock.module').then(
            (m) => m.SucursalProdStockModule
          ),
      },
      {
        path: 'menu-perfil',
        loadChildren: () =>
          import('./menu-perfil/menu-perfil.module').then(
            (m) => m.MenuPerfilModule
          ),
      },
      {
        path: 'cuenta-bancaria',
        loadChildren: () =>
          import('./cuenta-bancaria/cuenta-bancaria.module').then(
            (m) => m.CuentaBancariaModule
          ),
      },
       {
        path: 'formula-contable',
        loadChildren: () =>
          import('./formula-contable/formula-contable.module').then(
            (m) => m.FormulaContableModule
          ),
      },
      {
        path: 'producto-imagen',
        loadChildren: () =>
          import('./producto-imagen/producto-imagen.module').then(
            (m) => m.ProductoImagenModule
          ),
      },
      {
        path: 'sucursal-producto',
        loadChildren: () =>
          import('./sucursal-producto/sucursal-producto.module').then(
            (m) => m.SucursalProductoModule
          ),
      },
       {
        path: 'proveedor',
        loadChildren: () =>
          import('./proveedor/proveedor.module').then(
            (m) => m.ProveedorModule
          ),
      },
      {
        path: 'producto-precio',
        loadChildren: () =>
          import('./producto-precio/producto-precio.module').then(
            (m) => m.ProductoPrecioModule
          ),
      },
       {
        path: 'producto-proveedor',
        loadChildren: () =>
          import('./producto-proveedor/producto-proveedor.module').then(
            (m) => m.ProductoProveedorModule
          ),
      },
        {
        path: 'promocion',
        loadChildren: () =>
          import('./promocion/promocion.module').then(
            (m) => m.PromocionModule
          ),
      },
       {
        path: 'promocion-obsequio',
        loadChildren: () =>
          import('./promocion-obsequio/promocion-obsequio.module').then(
            (m) => m.PromocionObsequioModule
          ),
      },
/*COMIENZA SIACE */

      {
        path: 'emprendedor',
        loadChildren: () =>
          import('./emprendedor/emprendedor.module').then(
            (m) => m.EmprendedorModule
          ),
      },
      {
        path: 'estadistica',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then(
            (m) => m.EstadisticasModule
          ),
      },
      {
        path: 'estadistica',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then(
            (m) => m.EstadisticasModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'nivel',
        loadChildren: () =>
          import('./nivel/nivel.module').then((m) => m.NivelModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'permiso',
        loadChildren: () =>
          import('./permiso/permiso.module').then((m) => m.PermisoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'pilar',
        loadChildren: () =>
          import('./pilar/pilar.module').then((m) => m.PilarModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'respuesta-a3',
        loadChildren: () =>
          import('./respuesta-a3/respuesta-a3.module').then(
            (m) => m.RespuestaA3Module
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'tipo-aspecto',
        loadChildren: () =>
          import('./tipo-aspecto/tipo-aspecto.module').then(
            (m) => m.TipoAspectoModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'tipo-sesion',
        loadChildren: () =>
          import('./tipo-sesion/tipo-sesion.module').then(
            (m) => m.TipoSesionModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'rol',
        loadChildren: () =>
          import('./role/role.module').then((m) => m.RoleModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'usuario',
        loadChildren: () =>
          import('./usuario/usuario.module').then((m) => m.UsuarioModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'cuestionario',
        loadChildren: () =>
          import('./cuestionario/cuestionario.module').then(
            (m) => m.CuestionarioModule
          ),
      },
      {
        path: 'monitor',
        loadChildren: () =>
          import('./monitor/monitor.module').then((m) => m.MonitorModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'auditoria',
        loadChildren: () =>
          import('./auditoria/auditoria.module').then((m) => m.AuditoriaModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'formulario-cuestionario',
        loadChildren: () =>
          import('./cuestionario/cuestionario.module').then(
            (m) => m.CuestionarioModule
          ),
      },

      {
        path: 'version',
        loadChildren: () =>
          import('./version/version.module').then((m) => m.VersionModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'necesidad',
        loadChildren: () =>
          import('./necesidad/necesidad.module').then((m) => m.NecesidadModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'nivel-estudio',
        loadChildren: () =>
          import('./nivel-estudio/nivel-estudio.module').then(
            (m) => m.NivelEstudioModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'giro',
        loadChildren: () =>
          import('./giro/giro.module').then((m) => m.GiroModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'notfound',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
