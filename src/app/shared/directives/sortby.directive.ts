import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[cmSortBy]'
})
export class SortByDirective {

  private sortProperty: string;

  @Output()
  sorted: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  @Input('cmSortBy')
  set sortBy(value: string) {
    this.sortProperty = value;
  }

  @HostListener('click', ["$event"])
  onClick(event: any) {
    event.preventDefault();
    this.sorted.next(this.sortProperty); // Raise clicked event
  }




}
