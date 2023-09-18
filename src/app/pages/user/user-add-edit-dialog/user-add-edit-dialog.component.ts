import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { TeamService } from 'src/app/core/services/database/team.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { ITeam } from 'src/app/shared/model/team.model';
import { IUser } from 'src/app/shared/model/user.model';
import { errorMessages, MyErrorStateMatcher, regExps } from 'src/app/shared/validators/custom.validators';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { UserStatusConstant } from 'src/app/shared/constants/user-status.constant';
import { UserRoleConstant } from 'src/app/shared/constants/user-role.constant';
import { findConstantValueByCode } from 'src/app/core/helpers/enum.helpers';

@Component({
  selector: 'jiki-user-add-edit-dialog',
  templateUrl: './user-add-edit-dialog.component.html',
  styleUrls: ['./user-add-edit-dialog.component.css']
})
export class UserAddEditDialogComponent extends AbstractOnDestroy implements OnInit, AfterContentChecked {
  userForm: FormGroup;
  emailFormControl: FormControl<string|null>;
  usernameFormControl: FormControl<string|null>;
  firstnameFormControl: FormControl<string|null>;
  lastnameFormControl: FormControl<string|null>;
  passwordFormControl: FormControl<string|null>;
  passwordConfirmFormControl: FormControl<string|null>;
  roleFormControl: FormControl<string|null>;
  statusFormControl: FormControl<string|null>;
  teamFormControl: FormControl<number|null>;
  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newUser: IUser;
  statuses = UserStatusConstant;
  roles = UserRoleConstant;
  teams: ITeam[];
  differentPassword:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<IUser>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _teamService: TeamService,
    private _growler: GrowlerService,
    private _changeDedectionRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit(){
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
        this.statusFormControl = new FormControl(findConstantValueByCode(this.statuses, this.dialogFormData.entity.status), [Validators.required]);
        this.teamFormControl = new FormControl(this.dialogFormData.entity.team? this.dialogFormData.entity.team.id:null, [Validators.required]);
    }else{
        this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
        this.usernameFormControl = new FormControl('', [Validators.required]);
        this.firstnameFormControl = new FormControl('', [Validators.required]);
        this.lastnameFormControl = new FormControl('', [Validators.required]);
        this.passwordFormControl = new FormControl('', [Validators.required, Validators.pattern(regExps['password'])]);
        this.passwordConfirmFormControl = new FormControl('', [Validators.required]);
        this.roleFormControl = new FormControl('', [Validators.required]);
        this.statusFormControl = new FormControl('');
        this.teamFormControl = new FormControl(null, [Validators.required]);
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
