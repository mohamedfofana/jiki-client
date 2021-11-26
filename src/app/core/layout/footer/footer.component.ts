import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jiki-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent  implements OnInit {
  copyRights = '' ;
  ngOnInit() {
    const currentYear = new Date().getUTCFullYear();
    this.copyRights = 'Copyright © ' + currentYear + ' All rights reserved.';
  }
}
