import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoriesComponent } from './stories/stories.component';
import { StoryViewEditComponent } from './story-view-edit.component/story-view-edit.component';


const routes: Routes = [
  { path: '', component: StoriesComponent },
  { path: 'viewEdit/:id', component: StoryViewEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class StoryRoutingModule {
  static components = [StoriesComponent,
                       StoryViewEditComponent
  ];
}
