import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterTextboxModule } from './filter-textbox/filter-textbox.module';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { SortByDirective } from './directives/sortby.directive';
import { BgColorDirective } from './directives/bg-color.directive';
import { SelectUserViewPipe } from './pipes/select-user-view.pipe';

@NgModule({
  imports: [CommonModule, FilterTextboxModule ],
  exports: [ CommonModule, FormsModule, CapitalizePipe, TrimPipe, SortByDirective, BgColorDirective, FilterTextboxModule, SelectUserViewPipe ],
  declarations: [ CapitalizePipe, TrimPipe, SortByDirective, BgColorDirective, SelectUserViewPipe ],
  providers: [SelectUserViewPipe]
})
export class SharedModule { }
