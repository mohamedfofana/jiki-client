import { MyMaterialModule } from './../pages/material/material-module';
import { RouterModule } from '@angular/router';
import { WidgetStatics } from './widget-statics';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, 
            ReactiveFormsModule, 
            RouterModule, 
            MyMaterialModule],
  exports: [ WidgetStatics.components],
  declarations: [ WidgetStatics.components ]
})
export class WidgetModule { }
