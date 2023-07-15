import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamAddEditDialogComponent } from './team-add-edit-dialog/team-add-edit-dialog.component';
import { TeamsComponent } from './teams/teams.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetModule } from 'src/app/widget/widget.module';
import { MyMaterialModule } from '../material/material-module';


@NgModule({
  declarations: [
    TeamAddEditDialogComponent,
    TeamsComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MyMaterialModule
  ]
})
export class TeamModule { }
