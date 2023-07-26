import { SprintsComponent } from './sprints/sprints.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SprintAddEditDialogComponent } from './sprint-add-edit-dialog/sprint-add-edit-dialog.component';


const routes: Routes = [
  { path: '', component: SprintsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule {
  static components = [SprintsComponent, SprintAddEditDialogComponent];
}
