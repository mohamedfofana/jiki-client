import { DatePipe } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { TeamService } from 'src/app/core/services/database/team.service';
import { TeamStatusEnum } from 'src/app/shared/enum/team-status.enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { ITeam } from 'src/app/shared/model/team.model';
import { errorMessages, MyErrorStateMatcher, regExps } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'app-team-add-edit-dialog',
  templateUrl: './team-add-edit-dialog.component.html',
  styleUrls: ['./team-add-edit-dialog.component.css']
})
export class TeamAddEditDialogComponent extends AbstractOnDestroy implements OnInit, AfterContentChecked {
  teamForm: FormGroup;
  nameFormControl: FormControl;
  statusFormControl: FormControl;
  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newTeam: ITeam;
  statuses = TeamStatusEnum;
  enumKeys = Object.keys;
  differentPassword:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TeamAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<ITeam>,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _teamService: TeamService,
    private _growler: GrowlerService,
    private _changeDedectionRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit(){
    this.initForm();
  }

  initForm(){
    if (this.dialogFormData.entity){
        this.nameFormControl = new FormControl(this.dialogFormData.entity.name, [Validators.required]);
        this.statusFormControl = new FormControl(this.dialogFormData.entity.status, [Validators.required]);
    }else{
        this.nameFormControl = new FormControl('', [Validators.required]);
        this.statusFormControl = new FormControl('', [Validators.required]);
     }
     this.teamForm = this._formBuilder.group({
      name : this.nameFormControl,
      status : this.statusFormControl
    });
  }

  ngAfterContentChecked(): void {
    this._changeDedectionRef.detectChanges();
}

  onSubmitClick(): void {
    this.differentPassword = false;
    this.setFormError(false, '');
    this.newTeam = this.teamForm.value;
   if (this.dialogFormData.entity){
      this.newTeam.id=this.dialogFormData.entity.id;
      let subscriptionTeamAdd = this._teamService.update(this.newTeam)
        .subscribe((response: IResponseType<ITeam>) => {
                if(response.status === "OK"){
                  this.newTeam = response.entity;
                  this._growler.growl('Team updated', GrowlerMessageType.Success);
                  this.copyTeam(this.dialogFormData, this.newTeam);
                  this.dialogRef.close(this.dialogFormData);
                }else{
                  this.setFormError(true, "Unable to update the team");
                }
        });
      this.subscriptions.push(subscriptionTeamAdd);
    }else{
      let subscriptionTeamAdd = this._teamService.create(this.newTeam)
        .subscribe((response: IResponseType<ITeam>) => {
              if(response.status === "OK"){
                this.newTeam = response.entity;
                this._growler.growl('Team created', GrowlerMessageType.Success);
                this.copyTeam(this.dialogFormData, this.newTeam);
                this.dialogRef.close(this.dialogFormData);
              }else{
                this.setFormError(true, "Unable to create the team");
              }
        });
      this.subscriptions.push(subscriptionTeamAdd);
    }

  }
  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }
  hasError(controlName: string, errorName: string) :boolean {
    return this.teamForm.controls[controlName].hasError(errorName);
  }

  copyTeam(dialogFormData: IDialogFormData<ITeam>, newT: ITeam) {
    if(dialogFormData.entity){
      dialogFormData.entity.id = newT.id;
      dialogFormData.entity.name = newT.name;
      dialogFormData.entity.status = newT.status;
      dialogFormData.entity.creationDate =  newT.creationDate;
      dialogFormData.entity.updateDate = newT.updateDate;
    }{
      dialogFormData.entity = newT;
    }
  }
}
