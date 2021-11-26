import { ISprint } from './../../shared/model/sprint-model';
import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'figuretip',
  templateUrl: './item-sprint.component.html',
  styleUrls: [ './item-sprint.component.css' ]
})
export class ItemSprintComponent  implements OnInit {
  @Input() sprint: ISprint;
  @ViewChild('titleEl') titleEl: ElementRef;
  isActive: boolean = false;

  ngOnInit(): void {
    this.toggleClass();
  }

  toggle() {
    this.isActive = !this.isActive;
    this.toggleClass();
  }

  toggleClass() {
    if (!this.isActive){
      this.titleEl.nativeElement.classList.add('caret');
      this.titleEl.nativeElement.classList.remove('caret-down');
    }else{
      this.titleEl.nativeElement.classList.add('caret-down');
    }
  }
}
