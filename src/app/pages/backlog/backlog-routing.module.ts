import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BacklogsComponent } from './backlogs/backlogs.component';

const routes: Routes = [
  { path: '', component: BacklogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BacklogRoutingModule {
  static components = [BacklogsComponent];
}
