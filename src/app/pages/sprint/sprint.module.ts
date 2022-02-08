import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { MyMaterialModule } from './../material/material-module';
import { WidgetModule } from './../../widget/widget.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintRoutingModule } from './sprint-routing.module';
import { SprintAddEditDialogComponent } from './sprint-add-edit-dialog/sprint-add-edit-dialog.component';



@NgModule({
  declarations: [SprintRoutingModule.components, SprintAddEditDialogComponent],
  imports: [
    ReactiveFormsModule,
    SprintRoutingModule,
    SharedModule,
    WidgetModule,
    CommonModule,
    MyMaterialModule
  ]
})
export class SprintModule { }
