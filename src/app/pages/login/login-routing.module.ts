import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthenticatedGuard } from 'src/app/shared/guards/authenticated.guard';
import { LoginGuard } from 'src/app/shared/guards/login.guard';

const routes: Routes = [
      { path: 'login', 
        component: LoginComponent,
        canActivate: [LoginGuard] 
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
  static componnents = [LoginComponent];
}
