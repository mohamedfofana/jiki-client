import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'board', pathMatch: 'full'
  },
  {
    path: 'board',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/board/board.module').then (m => m.BoardModule)
  },
  {
    path: 'backlog',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/backlog/backlog.module').then (m => m.BacklogModule)
  },
  {
    path: 'sprints',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/sprint/sprint.module').then (m => m.SprintModule)
  },
  {
    path: 'users',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/user/user.module').then (m => m.UserModule)
  },
  {
    path: 'projects',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/project/project.module').then (m => m.ProjectModule)
  },
  {
    path: 'teams',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/team/team.module').then (m => m.TeamModule)
  },
  {
    path: 'stories',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/story/story.module').then (m => m.StoryModule)
  },
  {
    path: '**', redirectTo: 'board', pathMatch: 'full'
  }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [AuthenticatedGuard]
})
export class AppRoutingModule { }

