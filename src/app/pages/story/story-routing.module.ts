import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoriesComponent } from './stories/stories.component';

const routes: Routes = [
  { path: '', component: StoriesComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class StoryRoutingModule {
  static components = [StoriesComponent];
}
