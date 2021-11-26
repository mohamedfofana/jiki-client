import { CommonModule } from '@angular/common';
import { WidgetModule } from './../../widget/widget.module';
import { MyMaterialModule } from './../material/material-module';
import { NgModule } from '@angular/core';
import { BacklogRoutingModule } from './backlog-routing.module';

@NgModule({
  declarations: [BacklogRoutingModule.components],
  imports: [WidgetModule, BacklogRoutingModule, MyMaterialModule, CommonModule]
})
export class BacklogModule { }
