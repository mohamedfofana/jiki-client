import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserAddEditDialogComponent } from './user-add-edit-dialog/user-add-edit-dialog.component';

const routes: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
  static components = [UsersComponent, UserAddEditDialogComponent];
}
