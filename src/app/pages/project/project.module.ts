import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MyMaterialModule } from '../material/material-module';
import { ProjectViewEditComponent } from './project-view-edit/project-view-edit.component';

@NgModule({
  declarations: [ProjectRoutingModule.components],
  imports:
    [ProjectRoutingModule,
     ReactiveFormsModule,
     SharedModule,
     CommonModule,
     MyMaterialModule]
})
export class ProjectModule { }
