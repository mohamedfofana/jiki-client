import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jiki-page-title',
  templateUrl: './item-page-title.component.html',
  styleUrls: ['./item-page-title.component.css']
})
export class ItemPageTitleComponent implements OnInit {
  @Input() title:string;
  constructor() { }

  ngOnInit(): void {
  }

}
