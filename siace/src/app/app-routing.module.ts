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
          import('./proveedor/proveedor.module').then((m) => m.ProveedorModule),
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
          import('./promocion/promocion.module').then((m) => m.PromocionModule),
      },
      {
        path: 'promocion-obsequio',
        loadChildren: () =>
          import('./promocion-obsequio/promocion-obsequio.module').then(
            (m) => m.PromocionObsequioModule
          ),
      },
      {
        path: 'promocion-detalle',
        loadChildren: () =>
          import('./promocion-detalle/promocion-detalle.module').then(
            (m) => m.PromocionDetalleModule
          ),
      },
      {
        path: 'combo',
        loadChildren: () =>
          import('./combo/combo.module').then((m) => m.ComboModule),
      },
      // BANNER MODULE
      {
        path: 'banner',
        loadChildren: () =>
          import('./banner/banner.module').then((m) => m.BannerModule),
      },
      /*COMIENZA SIACE */
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
