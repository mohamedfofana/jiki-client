import { MyMaterialModule } from './../pages/material/material-module';
import { RouterModule } from '@angular/router';
import { WidgetStatics } from './widget-statics';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableInputComponent } from './editable-input/editable-input.component';

@NgModule({
  imports: [CommonModule, 
            FormsModule,
            ReactiveFormsModule, 
            RouterModule, 
            MyMaterialModule],
  exports: [ WidgetStatics.components],
  declarations: [ WidgetStatics.components, EditableInputComponent ]
})
export class WidgetModule { }
