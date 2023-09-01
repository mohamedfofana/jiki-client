import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { SprintWorkflowEnum } from 'src/app/shared/enum/sprint-workflow..enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { IProject } from 'src/app/shared/model/project.model';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { errorMessages, MyErrorStateMatcher } from 'src/app/shared/validators/custom.validators';
@Component({
  selector: 'app-sprint-add-edit-dialog',
  templateUrl: './sprint-add-dialog.component.html',
  styleUrls: ['./sprint-add-dialog.component.css']
})
export class SprintAddDialogComponent extends AbstractOnDestroy implements OnInit, AfterContentChecked {
  sprintForm: FormGroup;
  titleFormControl: FormControl<string | null>;
  descriptionFormControl: FormControl<string | null>;

  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newSprint: ISprint;
  statuses = SprintStatusEnum;
  workflows = SprintWorkflowEnum;
  projects: IProject[];
  enumKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<SprintAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<ISprint>,
    private _formBuilder: FormBuilder,
    private _projectService: ProjectService,
    private _sprintService: SprintService,
    private _storageService: StorageService,
    private _growler: GrowlerService,
    private _changeDedectionRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit(){
    this.initProjects();
    this.initForm();
  }

  initForm(){
    if (this.dialogFormData.entity){
        this.titleFormControl = new FormControl(this.dialogFormData.entity.title, [Validators.required]);
        this.descriptionFormControl = new FormControl(this.dialogFormData.entity.description, [Validators.required]);
      
     }else{
        this.titleFormControl = new FormControl('', [Validators.required]);
        this.descriptionFormControl = new FormControl('', [Validators.required]);
      
     }
     this.sprintForm = this._formBuilder.group({
      title : this.titleFormControl,
      description : this.descriptionFormControl,
     });
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
    this.setFormError(false, '');
    this.newSprint = this.sprintForm.value;
      this.newSprint.project = this._storageService.getProject();
      this.newSprint.reporter = this._storageService.getUser();
      let subscriptionUserAdd = this._sprintService.create(this.newSprint)
        .subscribe((response: IResponseType<ISprint>) => {
              if(response.status === "OK"){
                this.newSprint = response.entity;
                this._growler.growl('Sprint created', GrowlerMessageType.Success);
                this.copySprint(this.dialogFormData, this.newSprint);
                this.dialogRef.close(this.dialogFormData);
              }else{
                this.setFormError(true, "Unable to create the sprint");
              }
        });
      this.subscriptions.push(subscriptionUserAdd);

  }
  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }
  hasError(controlName: string, errorName: string) :boolean {
    return this.sprintForm.controls[controlName].hasError(errorName);
  }

  copySprint(dialogFormData: IDialogFormData<ISprint>, newT: ISprint) {
    if(dialogFormData.entity){
      dialogFormData.entity.id = newT.id;
      dialogFormData.entity.title = newT.title;
      dialogFormData.entity.description = newT.description;
    }{
      dialogFormData.entity = newT;
    }
  }
}
