import { AuthenticatedGuard } from './shared/authenticated.guard';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
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
    path: 'project',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/project/project.module').then (m => m.ProjectModule)
  },
  {
    path: 'stories',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/story/stories/story.module').then (m => m.StoryModule)
  },
  {
    path: 'sprints',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/sprint/sprint.module').then (m => m.SprintModule)
  },
  {
    path: 'backlog',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./pages/backlog/backlog.module').then (m => m.BacklogModule)
  },
  {
    path: '**', redirectTo: 'board', pathMatch: 'full'
  }
];

@NgModule({
imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadModulesStrategy })],
exports: [RouterModule],
providers: [PreloadModulesStrategy, AuthenticatedGuard]
})
export class AppRoutingModule { }

