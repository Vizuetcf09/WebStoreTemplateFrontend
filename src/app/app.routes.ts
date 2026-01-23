import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './pages/layout/store-layout/store-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsLayoutComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsLayoutComponent },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/store/store.component')
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('./pages/layout/checkout/Success.component')
      },
      {
        path: 'checkout/cancel',
        loadComponent: () => import('./pages/layout/checkout/Cancel.component')
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
