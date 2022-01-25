import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AuthService } from 'src/app/core/services/database/auth.service';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { LoggerService } from 'src/app/core/services/utils/logger.service';
import { IUserLogin } from 'src/app/shared/interfaces';
import { AbstractOnDestroy } from '../../core/services/abstract.ondestroy';

@Component({
    selector: 'user-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})
export class LoginComponent extends AbstractOnDestroy implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private authService: AuthService,
                private growler: GrowlerService,
                private logger: LoggerService) {
                  super();
                 }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.loginForm = this.formBuilder.group({
            username:      ['', [ Validators.required ]],
            password:   ['', [ Validators.required ]]
        });
    }
    get username(): any {
      return this.loginForm.get('username');
    }

    get password(): any {
      return this.loginForm.get('password');
    }
    submit({ value, valid }: { value: IUserLogin, valid: boolean }) {
      this.setError('');
       let subscription = this.authService.login(value)
            .subscribe((status: boolean) => {
                if (status) {
                    this.growler.growl('Logged in', GrowlerMessageType.Info);
                    if (this.authService.redirectUrl) {
                        const redirectUrl = this.authService.redirectUrl;
                        this.authService.redirectUrl = '';
                        this.router.navigate([redirectUrl]);
                    } else {
                        this.router.navigate(['/board']);
                    }
                } else {
                    this.setError('Email or password incorrect.');

                }
            },
            (err: any) => {
              this.setError('Email or password incorrect.');
                this.logger.log(err)
            });
            this.subscriptions.push(subscription);
    }

    setError(loginError:string){
      this.errorMessage = loginError;
    }
}
