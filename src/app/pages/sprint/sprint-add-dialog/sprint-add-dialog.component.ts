import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { IResponseType } from 'src/app/shared/interfaces';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { errorMessages, MyErrorStateMatcher } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'app-sprint-add-edit-dialog',
  templateUrl: './sprint-add-dialog.component.html',
  styleUrls: ['./sprint-add-dialog.component.css']
})
export class SprintAddDialogComponent extends AbstractOnDestroy implements OnInit {
  sprintForm: FormGroup;
  titleFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', [Validators.required]);

  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newSprint: ISprint;

  constructor(
    public dialogRef: MatDialogRef<SprintAddDialogComponent>,
    private _formBuilder: FormBuilder,
    private _sprintService: SprintService,
    private _storageService: StorageService,
    private _growler: GrowlerService) {
    super();
  }

  ngOnInit(){
    this.initForm();
  }

  initForm(){
     this.sprintForm = this._formBuilder.group({
      title : this.titleFormControl,
      description : this.descriptionFormControl,
     });
  }

  onSubmitClick(): void {
    this.setFormError(false, '');
    this.newSprint = this.sprintForm.value;
      this.newSprint.project = this._storageService.getProject();
      this.newSprint.reporter = this._storageService.getUser();
      let subscriptionUserAdd = this._sprintService.create(this.newSprint)
        .subscribe((response: IResponseType<ISprint>) => {
              if(response.status === "OK"){
                this._growler.growl('Sprint created', GrowlerMessageType.Success);
                this.dialogRef.close();
              }else{
                this.setFormError(true, "Unable to create sprint");
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

}
