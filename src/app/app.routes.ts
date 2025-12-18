import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './pages/layout/store-layout/store-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { StoreComponent } from './pages/store/store.component';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'store', component: StoreComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
