import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
  declarations: [ProjectRoutingModule.components],
  imports: [ProjectRoutingModule, ReactiveFormsModule]
})
export class ProjectModule { }
