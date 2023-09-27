import { NgModule } from '@angular/core';
import { TicketsComponent } from './tickets/tickets.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: TicketsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TicketRoutingModule { 
  static components = [TicketsComponent];
}
