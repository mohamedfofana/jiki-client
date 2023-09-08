import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryViewEditComponent } from './story-view-edit/story-view-edit.component';
import { StoryAddDialogComponent } from './story-add-dialog/story-add-dialog.component';


const routes: Routes = [
  { path: 'viewEdit/:id', component: StoryViewEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class StoryRoutingModule {
  static components = [ StoryViewEditComponent, StoryAddDialogComponent
  ];
}
