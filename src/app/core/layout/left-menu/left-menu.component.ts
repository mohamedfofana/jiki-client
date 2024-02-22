import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/database/auth.service';

declare let $: any;

@Component({
  selector: 'jiki-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css', './left-menu-mobile.component.css']
})
export class LeftMenuComponent implements OnInit {
  openCloseIcon:string="keyboard_arrow_left";
  menuIds: ['sprints', 'boards', 'backlog', 'reports'];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private _authservice: AuthService) { }

  ngOnInit() {
    const sub = this._authservice.isAuthenticatedSub().subscribe(state => {
      this.isLoggedIn = state;
      this.isAdmin = this._authservice.isUserAdmin();
    });

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
