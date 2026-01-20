import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './pages/layout/store-layout/store-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsLayoutComponent } from './pages/products/products.component';
import StoreComponent from './pages/store/store.component';

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
        loadComponent: () => import('./pages/store/checkout/Success.component').then(m => m.SuccessComponent)
      },
      {
        path: 'checkout/cancel',
        loadComponent: () => import('./pages/store/checkout/Cancel.component').then(m => m.CancelComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
