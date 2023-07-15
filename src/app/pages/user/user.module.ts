import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MyMaterialModule } from './../material/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UserRoutingModule.components
  ],
  imports: [
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    MyMaterialModule
  ]
})
export class UserModule { }
