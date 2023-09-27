import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket-routing.module';



@NgModule({
  declarations: [  TicketRoutingModule.components ],
  imports: [
    TicketRoutingModule,
    CommonModule
  ]
})
export class TicketModule { }
