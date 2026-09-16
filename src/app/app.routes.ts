import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './pages/layout/store-layout/store-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsLayoutComponent } from './pages/products/products.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsLayoutComponent },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/store/store.component')
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/store/store.component')
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/layout/cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('./pages/layout/checkout/Success.component').then(m => m.SuccessComponent)
      },
      {
        path: 'checkout/cancel',
        loadComponent: () => import('./pages/layout/checkout/Cancel.component').then(m => m.CancelComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/admin-products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'printful',
        loadComponent: () =>
          import('./pages/admin/printful/admin-printful.component').then(m => m.AdminPrintfulComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
