import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AuthService } from 'src/app/core/services/database/auth.service';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { IAuthResponse, IUserLogin } from 'src/app/shared/interfaces';
import { AbstractOnDestroy } from '../../core/services/abstract.ondestroy';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { JwtTokenService } from 'src/app/core/services/database/jwt-token.service';
import { map, mergeMap } from 'rxjs';
import { IProject } from 'src/app/shared/model/project.model';

@Component({
    selector: 'user-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})
export class LoginComponent extends AbstractOnDestroy implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';
    status: boolean = false;
    url: string;

    constructor(private _formBuilder: FormBuilder,
                private _router: Router,
                private _authService: AuthService,                
                private _projectService: ProjectService,
                private _jwtTokenService: JwtTokenService,
                private _storageService: StorageService,
                private _growler: GrowlerService,) {
                  super();
                 }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.loginForm = this._formBuilder.group({
            username: ['', [ Validators.required ]],
            password: ['', [ Validators.required ]]
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
       let subscription = this._authService.login(value).pipe(
                map((response: IAuthResponse) => { 
                  this.status = response.status;                                 
                  if (response.status){
                    this._storageService.login(response.user, response.token);
                    this._jwtTokenService.initToken(response.token);
                    
                      this._growler.growl('Logged in', GrowlerMessageType.Info);
                      if (this._authService.redirectUrl) {
                          this.url = this._authService.redirectUrl;
                      }if (this._storageService.getUser().role === 'ADMIN') {
                          this.url = '/users'
                      }
                      else {
                        this.url = '/board'
                      }                                                                
                  } else {
                      this.setError('Email or password incorrect.');
  
                  }
                }),
                mergeMap(() => 
                  this._projectService.findByTeam(this._storageService.getUser().team.id)
                ),
                map((project: IProject) => {
                  if(project){
                    this._storageService.setProject(project);           
                  }    
                })).subscribe(() => {         
                  if(this.status) {
                    this._authService.userAuthChanged(this.status);
                    this._router.navigate([this.url]);
                  }
              });

      this.subscriptions.push(subscription);
    }

    setError(loginError:string){
      this.errorMessage = loginError;
    }
}
