import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register-admin', component: RegisterAdminComponent},
    {path: 'register-client', component: RegisterClientComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'cart', component: CartComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'users', component: UsersComponent}
];
