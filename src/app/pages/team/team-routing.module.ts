import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamAddEditDialogComponent } from './team-add-edit-dialog/team-add-edit-dialog.component';
import { TeamsComponent } from './teams/teams.component';

const routes: Routes = [
  { path: '', component: TeamsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {
  static components = [TeamAddEditDialogComponent, TeamsComponent];
}
