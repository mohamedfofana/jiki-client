import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { TeamService } from 'src/app/core/services/database/team.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { LoggerService } from 'src/app/core/services/utils/logger.service';
import { UserRoleEnum } from 'src/app/shared/enum/user-role-enum';
import { UserStatusEnum } from 'src/app/shared/enum/user-status-enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { IProject } from 'src/app/shared/model/project.model';
import { ITeam } from 'src/app/shared/model/team.model';
import { IUser } from 'src/app/shared/model/user.model';
import { errorMessages, MyErrorStateMatcher, regExps } from 'src/app/shared/validators/custom.validators';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';

@Component({
  selector: 'jiki-user-add-edit-dialog',
  templateUrl: './user-add-edit-dialog.component.html',
  styleUrls: ['./user-add-edit-dialog.component.css']
})
export class UserAddEditDialogComponent extends AbstractOnDestroy implements OnInit, AfterContentChecked {
  userForm: FormGroup;
  emailFormControl: FormControl;
  usernameFormControl: FormControl;
  firstnameFormControl: FormControl;
  lastnameFormControl: FormControl;
  passwordFormControl: FormControl;
  passwordConfirmFormControl: FormControl;
  roleFormControl: FormControl;
  statusFormControl: FormControl;
  teamFormControl: FormControl;
  projectFormControl: FormControl;
  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newUser: IUser;
  statuses = UserStatusEnum;
  roles = UserRoleEnum;
  teams: ITeam[];
  projects: IProject[];
  enumKeys = Object.keys;
  differentPassword:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<IUser>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _projectService: ProjectService,
    private _teamService: TeamService,
    private _loggerService: LoggerService,
    private _growler: GrowlerService,
    private _changeDedectionRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit(){
    this.initProjects();
    this.initTeams();
    this.initForm();
  }

  initForm(){
    if (this.dialogFormData.entity){
        this.emailFormControl = new FormControl(this.dialogFormData.entity.email, [Validators.required, Validators.email]);
        this.usernameFormControl = new FormControl(this.dialogFormData.entity.username, [Validators.required]);
        this.firstnameFormControl = new FormControl(this.dialogFormData.entity.firstname, [Validators.required]);
        this.lastnameFormControl = new FormControl(this.dialogFormData.entity.lastname, [Validators.required]);
        this.passwordFormControl = new FormControl('',);
        this.passwordConfirmFormControl = new FormControl('',);
        this.roleFormControl = new FormControl(this.dialogFormData.entity.role, [Validators.required]);
        this.statusFormControl = new FormControl(this.dialogFormData.entity.status, [Validators.required]);
        this.teamFormControl = new FormControl(this.dialogFormData.entity.team.id, [Validators.required]);
        this.projectFormControl = new FormControl(this.dialogFormData.entity.project.id, [Validators.required]);

     }else{
        this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
        this.usernameFormControl = new FormControl('', [Validators.required]);
        this.firstnameFormControl = new FormControl('', [Validators.required]);
        this.lastnameFormControl = new FormControl('', [Validators.required]);
        this.passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(regExps['password'])]);
        this.passwordConfirmFormControl = new FormControl('', [Validators.required]);
        this.roleFormControl = new FormControl('', [Validators.required]);
        this.statusFormControl = new FormControl('', [Validators.required]);
        this.teamFormControl = new FormControl('', [Validators.required]);
        this.projectFormControl = new FormControl('', [Validators.required]);
     }
     this.userForm = this._formBuilder.group({
      email : this.emailFormControl,
      username : this.usernameFormControl,
      firstname : this.firstnameFormControl,
      lastname : this.lastnameFormControl,
      password : this.passwordFormControl,
      passwordConfirm: this.passwordConfirmFormControl,
      role : this.roleFormControl,
      status : this.statusFormControl,
      team : this._formBuilder.group({
          id: this.teamFormControl}),
      project : this._formBuilder.group({
          id: this.projectFormControl})
    });
  }
  initTeams(){
    let subscriptionTeams = this._teamService.findAll()
    .subscribe((teams: ITeam[]) => {
      if(teams){
        this.teams = teams;
      }
    });
  this.subscriptions.push(subscriptionTeams);
  }

  initProjects(){
    let subscriptionProjects = this._projectService.findAll()
    .subscribe((projects: IProject[]) => {
      if(projects){
        this.projects = projects;
      }
    });
  this.subscriptions.push(subscriptionProjects);
  }

  ngAfterContentChecked(): void {
    this._changeDedectionRef.detectChanges();
}

  onSubmitClick(): void {
    this.differentPassword = false;
    this.setFormError(false, '');
    this.newUser = this.userForm.value;
   if (this.dialogFormData.entity){
      this.newUser.id=this.dialogFormData.entity.id;
      let subscriptionUserAdd = this._userService.update(this.newUser)
        .subscribe((response: IResponseType<IUser>) => {
                if(response.status === "OK"){
                  this.newUser = response.entity;
                  this._growler.growl('User updated', GrowlerMessageType.Success);
                  this.copyUser(this.dialogFormData, this.newUser);
                  this.dialogRef.close(this.dialogFormData);
                }else{
                  this.setFormError(true, "Unable to update the user");
                }
        });
      this.subscriptions.push(subscriptionUserAdd);
    }else{
      let subscriptionUserAdd = this._userService.register(this.newUser)
        .subscribe((response: IResponseType<IUser>) => {
              if(response.status === "OK"){
                this.newUser = response.entity;
                this._growler.growl('User created', GrowlerMessageType.Success);
                this.copyUser(this.dialogFormData, this.newUser);
                this.dialogRef.close(this.dialogFormData);
              }else{
                this.setFormError(true, "Unable to create the user");
              }
        });
      this.subscriptions.push(subscriptionUserAdd);
    }

  }
  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }
  hasError(controlName: string, errorName: string) :boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  differentPasswords():boolean{
    if(this.passwordFormControl && this.passwordConfirmFormControl){
      if (!(this.passwordFormControl?.value === this.passwordConfirmFormControl?.value)){
        this.userForm?.controls['passwordConfirm']?.setErrors({
          different: true
        });
        return true;
      }else{
        this.userForm?.controls['passwordConfirm']?.setErrors(null);
        return false;
      }
   }
   return true;
  }


  copyUser(dialogFormData: IDialogFormData<IUser>, newT: IUser) {
    if(dialogFormData.entity){
      dialogFormData.entity.id = newT.id;
      dialogFormData.entity.firstname = newT.firstname;
      dialogFormData.entity.lastname = newT.lastname;
      dialogFormData.entity.email = newT.email;
      dialogFormData.entity.username = newT.username;
      dialogFormData.entity.role = newT.role;
      dialogFormData.entity.status = newT.status;
      dialogFormData.entity.creationDate =  newT.creationDate;
      dialogFormData.entity.updateDate = newT.updateDate;
    }{
      dialogFormData.entity = newT;
    }
  }
}
