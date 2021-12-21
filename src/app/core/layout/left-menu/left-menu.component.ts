import { Component, OnInit } from '@angular/core';

declare let $: any;

@Component({
  selector: 'jiki-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css', './left-menu-mobile.component.css']
})
export class LeftMenuComponent implements OnInit {
  openCloseIcon:string="keyboard_arrow_left";
  menuIds: ['sprints', 'boards', 'backlog', 'reports'];

  constructor() { }

  ngOnInit() {
    $( '.components a' ).on( 'click', () => {
      $( '.components' ).find( 'li.active' ).removeClass( 'active' );
      $(this).parent( 'li' ).addClass( 'active' );
    });

    $('#sidebarCollapse').on('click', function() {
      $('#sidebar').toggleClass('active');
      // $('.list-group-item').toggleClass('p-1');
      $('.side-menu-title').toggleClass('display-0');
   });

  }

  openClose() {
    if (this.openCloseIcon === "keyboard_arrow_left") {
       this.openCloseIcon = "keyboard_arrow_right";
    } else {
       this.openCloseIcon = "keyboard_arrow_left";

    }
  }

}
