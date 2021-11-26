import { MyMaterialModule } from './../material/material-module';
import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [ LoginRoutingModule.componnents ],
  imports: [
    ReactiveFormsModule,
    CoreModule,
    MyMaterialModule,
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
