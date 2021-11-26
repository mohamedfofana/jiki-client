import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[jiki-item-board]',
  templateUrl: './item-board.component.html',
  styleUrls: ['./item-board.component.css']
})
export class ItemBoardComponent implements OnInit {
  @Input() title:string;
  @Input() description:string;
  @Input() icon:string;
  constructor() { }

  ngOnInit(): void {
  }

}
