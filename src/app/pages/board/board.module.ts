import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from './../material/material-module';
import { WidgetModule } from './../../widget/widget.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  declarations: [BoardRoutingModule.components],
  imports: [BoardRoutingModule, WidgetModule, CommonModule, MyMaterialModule, ReactiveFormsModule]
})
export class BoardModule { }
