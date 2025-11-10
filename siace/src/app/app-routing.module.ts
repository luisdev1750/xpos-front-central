import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'banco',
        loadChildren: () =>
          import('./banco/banco.module').then((m) => m.BancoModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sucursal',
        loadChildren: () =>
          import('./sucursal/sucursal.module').then((m) => m.SucursalModule),
        canActivate: [AuthGuard]
      },
        {
        path: 'productos-sugeridos',
        loadChildren: () =>
          import('./producto-sugerido/producto-sugerido.module').then((m) => m.ProductoSugeridoModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'marca',
        loadChildren: () =>
          import('./marca/marca.module').then((m) => m.MarcaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'familia',
        loadChildren: () =>
          import('./familia/familia.module').then((m) => m.FamiliaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'sucursal-configuracion',
        loadChildren: () =>
          import('./sucursal-config/sucursal-config.module').then(
            (m) => m.SucursalConfigModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'submarca',
        loadChildren: () =>
          import('./submarca/submarca.module').then((m) => m.SubmarcaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'presentacion',
        loadChildren: () =>
          import('./presentacion/presentacion.module').then(
            (m) => m.PresentacionModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'lista-precio',
        loadChildren: () =>
          import('./lista-precio/lista-precio.module').then(
            (m) => m.ListaPrecioModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then((m) => m.PerfilModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'usuario',
        loadChildren: () =>
          import('./usuario/usuario.module').then((m) => m.UsuarioModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tasa-cuota',
        loadChildren: () =>
          import('./tasa-cuota/tasa-cuota.module').then(
            (m) => m.TasaCuotaModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'tipo-promocion',
        loadChildren: () =>
          import('./tipo-promocion/tipo-promocion.module').then(
            (m) => m.TipoPromocionModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'producto',
        loadChildren: () =>
          import('./producto/producto.module').then((m) => m.ProductoModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'promocion-detalle',
        loadChildren: () =>
          import('./promocion-detalle/promocion-detalle.module').then(
            (m) => m.PromocionDetalleModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'sucursal-prod-stock',
        loadChildren: () =>
          import('./sucursal-prod-stock/sucursal-prod-stock.module').then(
            (m) => m.SucursalProdStockModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'menu-perfil',
        loadChildren: () =>
          import('./menu-perfil/menu-perfil.module').then(
            (m) => m.MenuPerfilModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'cuenta-bancaria',
        loadChildren: () =>
          import('./cuenta-bancaria/cuenta-bancaria.module').then(
            (m) => m.CuentaBancariaModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'formula-contable',
        loadChildren: () =>
          import('./formula-contable/formula-contable.module').then(
            (m) => m.FormulaContableModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'producto-imagen',
        loadChildren: () =>
          import('./producto-imagen/producto-imagen.module').then(
            (m) => m.ProductoImagenModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'sucursal-producto',
        loadChildren: () =>
          import('./sucursal-producto/sucursal-producto.module').then(
            (m) => m.SucursalProductoModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'proveedor',
        loadChildren: () =>
          import('./proveedor/proveedor.module').then((m) => m.ProveedorModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'producto-precio',
        loadChildren: () =>
          import('./producto-precio/producto-precio.module').then(
            (m) => m.ProductoPrecioModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'producto-proveedor',
        loadChildren: () =>
          import('./producto-proveedor/producto-proveedor.module').then(
            (m) => m.ProductoProveedorModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'promocion',
        loadChildren: () =>
          import('./promocion/promocion.module').then((m) => m.PromocionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'promocion-obsequio',
        loadChildren: () =>
          import('./promocion-obsequio/promocion-obsequio.module').then(
            (m) => m.PromocionObsequioModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'promocion-detalle',
        loadChildren: () =>
          import('./promocion-detalle/promocion-detalle.module').then(
            (m) => m.PromocionDetalleModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'combo',
        loadChildren: () =>
          import('./combo/combo.module').then((m) => m.ComboModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'banner',
        loadChildren: () =>
          import('./banner/banner.module').then((m) => m.BannerModule),
        canActivate: [AuthGuard]
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