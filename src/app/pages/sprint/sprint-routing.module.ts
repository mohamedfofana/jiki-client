import { SprintsComponent } from './sprints/sprints.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SprintAddDialogComponent } from './sprint-add-dialog/sprint-add-dialog.component';
import { SprintStartDialogComponent } from './sprint-start-dialog/sprint-start-dialog.component';
import { SprintCloseDialogComponent } from './sprint-close-dialog/sprint-close-dialog.component';


const routes: Routes = [
  { path: '', component: SprintsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule {
  static components = [ SprintsComponent, 
                        SprintAddDialogComponent, 
                        SprintStartDialogComponent,
                        SprintCloseDialogComponent ];
}
