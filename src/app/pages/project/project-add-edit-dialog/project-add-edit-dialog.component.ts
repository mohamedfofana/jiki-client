import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrowlerService, GrowlerMessageType } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { TeamService } from 'src/app/core/services/database/team.service';
import { ProjectStatusEnum } from 'src/app/shared/enum/project-status.enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { IProject } from 'src/app/shared/model/project.model';
import { ITeam } from 'src/app/shared/model/team.model';
import { errorMessages, MyErrorStateMatcher, regExps } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'app-project-add-edit-dialog',
  templateUrl: './project-add-edit-dialog.component.html',
  styleUrls: ['./project-add-edit-dialog.component.css']
})
export class ProjectAddEditDialogComponent extends AbstractOnDestroy implements OnInit, AfterContentChecked {
  projectForm: FormGroup;
  nameFormControl: FormControl;
  descriptionFormControl: FormControl;
  statusFormControl: FormControl;
  teamFormControl: FormControl;
 errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newProject: IProject;
  statuses = ProjectStatusEnum;
  teams: ITeam[];
  enumKeys = Object.keys;
  differentPassword:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProjectAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<IProject>,
    private _formBuilder: FormBuilder,
    private _projectService: ProjectService,
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
        this.nameFormControl = new FormControl(this.dialogFormData.entity.name, [Validators.required]);
        this.descriptionFormControl = new FormControl(this.dialogFormData.entity.description, [Validators.required]);
        this.statusFormControl = new FormControl(this.dialogFormData.entity.status, [Validators.required]);
        this.teamFormControl = new FormControl(this.dialogFormData.entity.team.id, [Validators.required]);

     }else{
        this.nameFormControl = new FormControl('', [Validators.required]);
        this.descriptionFormControl = new FormControl('', [Validators.required]);
        this.statusFormControl = new FormControl('', [Validators.required]);
        this.teamFormControl = new FormControl('', [Validators.required]);
     }
     this.projectForm = this._formBuilder.group({
      name : this.nameFormControl,
      description : this.descriptionFormControl,
      status : this.statusFormControl,
      team : this._formBuilder.group({
          id: this.teamFormControl})
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
    this.newProject = this.projectForm.value;
   if (this.dialogFormData.entity){
      this.newProject.id=this.dialogFormData.entity.id;
      let subscriptionProjectAdd = this._projectService.update(this.newProject)
        .subscribe((response: IResponseType<IProject>) => {
                if(response.status === "OK"){
                  this.newProject = response.entity;
                  this._growler.growl('Project updated', GrowlerMessageType.Success);
                  this.copyProject(this.dialogFormData, this.newProject);
                  this.dialogRef.close(this.dialogFormData);
                }else{
                  this.setFormError(true, "Unable to update the project");
                }
        });
      this.subscriptions.push(subscriptionProjectAdd);
    }else{
      let subscriptionProjectAdd = this._projectService.create(this.newProject)
        .subscribe((response: IResponseType<IProject>) => {
              if(response.status === "OK"){
                this.newProject = response.entity;
                this._growler.growl('Project created', GrowlerMessageType.Success);
                this.copyProject(this.dialogFormData, this.newProject);
                this.dialogRef.close(this.dialogFormData);
              }else{
                this.setFormError(true, "Unable to create the project");
              }
        });
      this.subscriptions.push(subscriptionProjectAdd);
    }

  }
  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }
  hasError(controlName: string, errorName: string) :boolean {
    return this.projectForm.controls[controlName].hasError(errorName);
  }

  copyProject(dialogFormData: IDialogFormData<IProject>, newT: IProject) {
    if(dialogFormData.entity){
      dialogFormData.entity.id = newT.id;
      dialogFormData.entity.name= newT.name;
      dialogFormData.entity.description = newT.description;
      dialogFormData.entity.status = newT.status;
      dialogFormData.entity.team.id = newT.team.id;
      dialogFormData.entity.creationDate =  newT.creationDate;
      dialogFormData.entity.updateDate = newT.updateDate;
    }{
      dialogFormData.entity = newT;
    }
  }
}
