import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/manage/categories/categories.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { BrandsComponent } from './components/manage/brands/brands.component';
import { BrandFormComponent } from './components/manage/brand-form/brand-form.component';
import { ProductComponent } from './components/manage/product/product.component';
import { ProductFormComponent } from './components/manage/product-form/product-form.component';
import { ProductListsComponent } from './components/product-lists/product-lists.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/manage/admin-dashboard/admin-dashboard.component';
import { adminGuard, authGuard } from './guards/auth-guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    component:  HomeComponent,
    canActivate:[authGuard]
  },
  {
    path: 'admin/categories',
    component: CategoriesComponent,
  },
  {
    path: 'admin/categories/add',
    component: CategoryFormComponent,
  },
  {
    path: 'admin/categories/:id',
    component: CategoryFormComponent,
  },
  {
    path: 'admin/brands',
    component: BrandsComponent,
  },
  {
    path: 'admin/brands/add',
    component: BrandFormComponent,
  },
  {
    path: 'admin/brands/:id',
    component: BrandFormComponent,
  },
  {
    path: 'admin/products',
    component: ProductComponent,
  },
  {
    path: 'admin/products/add',
    component: ProductFormComponent,
  },
  {
     path:'admin',
     component:  AdminDashboardComponent,
     canActivate:[adminGuard]
  } ,
  {
    path: 'admin/products/:id',
    component: ProductFormComponent,
  },
  {
    path: 'products',
    component: ProductListsComponent,
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
  {
     path:'user-profile', 
     component:UserProfileComponent,
  },
  {
    path: 'register',
  component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
