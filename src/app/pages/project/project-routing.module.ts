import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectUpdateComponent } from './project-update/project-update.component';

const routes: Routes = [
  { path: 'create', component: ProjectCreateComponent },
  { path: 'details/:id', component: ProjectDetailsComponent },
  { path: 'update', component: ProjectUpdateComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class ProjectRoutingModule {
  static components = [ProjectCreateComponent,ProjectUpdateComponent, ProjectDetailsComponent];
}
