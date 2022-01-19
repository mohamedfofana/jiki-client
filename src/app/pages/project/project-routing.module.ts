import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectAddEditDialogComponent } from './project-add-edit-dialog/project-add-edit-dialog.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class ProjectRoutingModule {
  static components = [ProjectsComponent, ProjectAddEditDialogComponent];
}
