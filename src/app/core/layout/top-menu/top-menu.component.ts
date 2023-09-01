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
import { ProjectService } from '../../services/database/project.service';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { SprintAddDialogComponent } from 'src/app/pages/sprint/sprint-add-dialog/sprint-add-dialog.component';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IStory } from 'src/app/shared/model/story.model';
import { SprintService } from '../../services/database/sprint.service';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';

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
  isLoggedInAsAdmin = false;
  project: IProject;
  emptySprint: ISprint;
  emptyStory: IStory;
  dataSource = new MatTableDataSource<ISprint>();
  
  constructor(private formBuilder: FormBuilder, 
              private router: Router, 
              public dialogConfirm: MatDialog,
              public dialog: MatDialog,
              private authservice: AuthService,
              private _sprintService: SprintService,
              private _storageService: StorageService,  
              private growler: GrowlerService,) {
  }

  ngOnInit() {
    $('.navbar-nav-top a').on('click', () => {
      $('.navbar-nav-top').find('li.active').removeClass('active');
      $(this).parent('li').addClass('active');
    });
    
    this.searchForm = this.formBuilder.group({
      searchText: ['', Validators.required]
    });
    
    this.sub = this.authservice.isAuthenticatedSub().subscribe(state => {
                            this.setLoginLogoutText(state);
                            this.isLoggedIn = state;
                            this.isLoggedInAsAdmin = this.authservice.isUserAdmin();
                            if(state && this._storageService.isUserInStorage() && !this.isLoggedInAsAdmin){
                              this.project =  this._storageService.getProject();
                            }
                            
    });

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
      let role = findEnumValueByKey(UserRoleEnum, user.role);
      this.isLoggedInAsAdmin = (role === UserRoleEnum.ADMIN) ? true : false;
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
    this.growler.growl('Logged Out', GrowlerMessageType.Info);
    this.authservice.logout();
    this.router.navigate(['/login']);
    this.setLoginLogoutText(false);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  addStory(story: IStory) {
    // Pop up create Story
    // Redirect to view edit page after creation
    // init on blacklog 
  }

  addSprint(sprint: ISprint) {
    const subscriptionSprint$ = this._sprintService.getSprintsByProjectId(this.project.id)
                                .subscribe((sprints: ISprint[]) => {                                
                                  if(sprints && sprints.length > 0){
                                    const created  = sprints.find(s => s.status === SprintStatusEnum.CREATED);
                                    const running  = sprints.find(s => s.status === SprintStatusEnum.RUNNING);
                                    if (created) {
                                      this.showPopupError('A sprint is already created. Please start the sprint.');
                                    }else if (running) {
                                      this.showPopupError('A sprint is in progress ...');
                                    }else {
                                      this.showPopupSprint(sprint);
                                    }                                    
                                  }else{                                   
                                    this.showPopupSprint(sprint);
                                  }
                                }
                              );
   
  }

  showPopupError(body: string) {
    const dialogData: IDialogData = {
      title: 'Warning !',
      body: body,
      okColor: 'warn',
      withActionButton: false,
      cancelButtonText: 'Ok',
      actionButtonText: 'Delete'
    };

    const dialogRef = this.dialogConfirm.open(ConfirmDialogComponent, {
      data: dialogData,
    });
  }

  showPopupSprint(sprint: ISprint) {
    let dialogData: IDialogFormData<ISprint> = {
      new: true,
      entity: sprint
    }
    const dialogRef = this.dialog.open(SprintAddDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.new){
        let data = this.dataSource.data;
        data.push(result.entity);
        this.dataSource.data = data;
      }
    });
  }

}
