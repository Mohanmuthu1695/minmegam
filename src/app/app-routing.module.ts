import { NgModule } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './providers/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin-routing.module').then((m) => m.AdminRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
