import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from 'src/app/widget/widget.module';
import { MyMaterialModule } from '../material/material-module';
import { StoryRoutingModule } from './story-routing.module';
import { NgxEditorModule } from 'ngx-editor';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoryAddComponent } from './story-add/story-add.component';

@NgModule({
  declarations: [StoryRoutingModule.components],
  imports: [StoryRoutingModule,
            RouterModule,
            ReactiveFormsModule,
            CommonModule,
            FormsModule,
            MyMaterialModule,
            HttpClientModule,
            WidgetModule,
            SharedModule,
            NgxEditorModule
           ]
})
export class StoryModule { }
