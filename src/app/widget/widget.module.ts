import { MyMaterialModule } from './../pages/material/material-module';
import { RouterModule } from '@angular/router';
import { WidgetStatics } from './widget-statics';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, 
            FormsModule,
            ReactiveFormsModule, 
            RouterModule, 
            SharedModule,
            MyMaterialModule],
  exports: [ WidgetStatics.components],
  declarations: [ WidgetStatics.components]
})
export class WidgetModule { }
