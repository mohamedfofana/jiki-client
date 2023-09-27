import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyMaterialModule } from '../material/material-module';
import { WidgetModule } from 'src/app/widget/widget.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [ ProfileRoutingModule.components ],
  imports: [
    CommonModule,
    WidgetModule,
    SharedModule,
    MyMaterialModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
