import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;
import { AuthService } from '../../services/database/auth.service';
import { GrowlerService, GrowlerMessageType } from '../../growler/growler.service';
import { Subscription } from 'rxjs';
import { findEnumValueByKey } from '../../helpers/enum.helpers';
import { UserRoleEnum } from 'src/app/shared/enum/user-role-enum';
import { StorageService } from '../../services/local/storage.service';
import { IProject } from 'src/app/shared/model/project.model';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { SprintAddDialogComponent } from 'src/app/pages/sprint/sprint-add-dialog/sprint-add-dialog.component';
import { IStory } from 'src/app/shared/model/story.model';
import { SprintService } from '../../services/database/sprint.service';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { DialogService } from '../../services/dialog/dialog.service';
import { AbstractOnDestroy } from '../../services/abstract.ondestroy';
import { StoryAddDialogComponent } from 'src/app/pages/story/story-add-dialog/story-add-dialog.component';
import { StoryService } from '../../services/database/story.service';
import { IAuthResponse, IResponseType } from 'src/app/shared/interfaces';

@Component({
  selector: 'jiki-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent extends AbstractOnDestroy implements OnInit {

  isCollapsed: boolean;
  searchForm: FormGroup;
  searchText: string;
  isLoggedIn = false;
  isLoggedInAsAdmin = false;
  project: IProject;
  emptySprint: ISprint;
  emptyStory: IStory;
  canCreateSprint: boolean = false;
  
  constructor(private formBuilder: FormBuilder, 
              private router: Router,
              private authservice: AuthService,
              private _storyService: StoryService,
              private _sprintService: SprintService,
              private _dialogService: DialogService,
              private _storageService: StorageService,  
              private growler: GrowlerService,) {
                super();
  }

  ngOnInit() {
    this.canCreateSprint = this._storageService.isUserSubroleAdmin();
    $('.navbar-nav-top a').on('click', () => {
      $('.navbar-nav-top').find('li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
    
    this.searchForm = this.formBuilder.group({
      searchText: ['', Validators.required]
    });
    
    const sub = this.authservice.isAuthenticatedSub().subscribe(state => {
                            this.setLoginLogoutText(state);
                            this.isLoggedIn = state;
                            this.isLoggedInAsAdmin = this.authservice.isUserAdmin();
                            if(state && this._storageService.isUserInStorage() && !this.isLoggedInAsAdmin){
                              this.project =  this._storageService.getProject();
                            }
    });
    this.subscriptions.push(sub);
    this.initAuth(); 
  }

  initAuth(): void{
    if (this._storageService.isUserInStorage()){
      this.authservice.userAuthChanged(true);
    }else{
      this.authservice.userAuthChanged(false);
    }
  }

  
  setLoginLogoutText(state: boolean) {
    if(state){
      const user = this._storageService.getUser();
      this.isLoggedInAsAdmin = (user.role === UserRoleEnum.ADMIN) ? true : false;
    }
  }

  onSubmit(): void {
    this.searchText = this.searchForm.controls['searchText'].value;
    if (this.searchText.length > 0) {
      this.router.navigate(['/resultSearch', { q: this.searchText }]);
    }
  }

  login() {
    this.redirectToLogin();
  }

  logout() {
    this.growler.growl('Logged Out', GrowlerMessageType.Info);
    this.authservice.logout();
    this.router.navigate(['/login']);
    this.setLoginLogoutText(false);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  addStory(story: IStory) {
    this._dialogService.showPopupComponent(story, StoryAddDialogComponent);    
  }

  addSprint(sprint: ISprint) {
    const subscriptionSprint$ = this._sprintService.findByProjectId(this.project.id)
                                .subscribe((sprints: ISprint[]) => {                                
                                  if(sprints && sprints.length > 0){
                                    const created  = sprints.find(s => s.status === SprintStatusEnum.CREATED);
                                    if (created) {
                                      this._dialogService.showPopupError('A sprint is already created. Please start the sprint or close the current.');
                                    }else {
                                      this._dialogService.showPopupComponent(sprint, SprintAddDialogComponent);
                                    }                                    
                                  }else{                                   
                                    this._dialogService.showPopupComponent(sprint, SprintAddDialogComponent);
                                  }
                                }
                              );
    this.subscriptions.push(subscriptionSprint$);
  }  
}
