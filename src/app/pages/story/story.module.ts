import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { WidgetModule } from 'src/app/widget/widget.module';
import { MyMaterialModule } from '../material/material-module';
import { StoryRoutingModule } from './story-routing.module';

@NgModule({
  declarations: [StoryRoutingModule.components],
  imports: [StoryRoutingModule,
            ReactiveFormsModule,
            CommonModule,
            FormsModule,
           MyMaterialModule,
           HttpClientModule,
           WidgetModule,
           ]
})
export class StoryModule { }
