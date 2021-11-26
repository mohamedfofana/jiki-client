import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;
import { AuthService } from '../../services/database/auth.service';
import { GrowlerService, GrowlerMessageType } from '../../growler/growler.service';
import { LoggerService } from '../../services/utils/logger.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jiki-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit, OnDestroy {

  isCollapsed: boolean;
  sub: Subscription;
  searchForm: FormGroup;
  searchText: string;
  isLoggedIn = false;
  // tslint:disable-next-line: variable-name
  constructor(private formBuilder: FormBuilder, private router: Router, private authservice: AuthService,
    private growler: GrowlerService,
    private logger: LoggerService) {
  }

  ngOnInit() {
    $('.navbar-nav-top a').on('click', () => {
      $('.navbar-nav-top').find('li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
    this.searchForm = this.formBuilder.group({
      searchText: ['', Validators.required]
    });
    this.sub = this.authservice.authChanged
    .subscribe((data: boolean) => {
      this.setLoginLogoutText();
    },
    (err: any) => this.logger.log(err));
    this.initAuth();
  }

  initAuth(): void{
    if (localStorage.getItem('top_token')){
      this.authservice.userAuthChanged(true);
    }else{
      this.authservice.userAuthChanged(false);
    }
  }

  onSubmit(): void {
    this.searchText = this.searchForm.controls['searchText'].value;
    if (this.searchText.length > 0) {
      this.router.navigate(['/resultSearch', { q: this.searchText }]);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  login() {
    this.redirectToLogin();
  }

  logout() {
    const isAuthenticated = this.authservice.isAuthenticated;
    // No need to delete token on server. It will expire soon ?, Create a service to remove token when login out
    if (isAuthenticated) {
      this.growler.growl('Logged Out', GrowlerMessageType.Info);
      this.authservice.logout();
      this.router.navigate(['/login']);
      this.authservice.isAuthenticated = false;
      this.setLoginLogoutText();
      return;
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  setLoginLogoutText() {
    this.isLoggedIn = (this.authservice.isAuthenticated) ? true : false;
  }

}
