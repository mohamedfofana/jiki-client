import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { DateService } from 'src/app/core/services/local/date.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { SprintDurationConstant } from 'src/app/shared/constants/sprint-duration.constant';
import { SprintDurationEnum } from 'src/app/shared/enum/sprint-duration.enum';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { MyErrorStateMatcher, errorMessages } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'jiki-sprint-start-dialog',
  templateUrl: './sprint-start-dialog.component.html',
  styleUrls: ['./sprint-start-dialog.component.css']
})
export class SprintStartDialogComponent extends AbstractOnDestroy implements OnInit {
  sprintForm: FormGroup;
  nameFormControl = new FormControl('', [Validators.required]);
  goalFormControl = new FormControl('', [Validators.required]);
  durationFormControl = new FormControl<string>('', [Validators.required]);
  startDateFormControl = new FormControl<Date>(new Date(), [Validators.required]);
  endDateFormControl = new FormControl<Date | null>(null, [Validators.required]);
  durations = SprintDurationConstant;
  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newSprint: ISprint;
  endDateStartAt: Date;

  constructor(  
              public dialogRef: MatDialogRef<SprintStartDialogComponent>,    
              @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<ISprint>,
              private _formBuilder: FormBuilder,
              private _dateService: DateService,
              private _sprintService: SprintService,
              private _storageService: StorageService,
              private _router: Router,
              private _growler: GrowlerService) {
    super();
  }

  ngOnInit(){
    this.initForm();
  }

  initForm(){
     this.sprintForm = this._formBuilder.group({
      name : this.nameFormControl,
      goal : this.goalFormControl,
      duration : this.durationFormControl,
      startDate : this.startDateFormControl,
      endDate : this.endDateFormControl
     });
     this.startDateFormControl.disable();
     this.endDateFormControl.disable();
  }

  onSubmitClick(): void {
    this.setFormError(false, '');
    this.startDateFormControl.enable();
    this.endDateFormControl.enable();
    this.newSprint = this.sprintForm.value;
    this.startDateFormControl.disable();
    this.endDateFormControl.disable();
    this.newSprint.id = this.dialogFormData.entity? this.dialogFormData.entity.id:0; // Error
    this.newSprint.project = this._storageService.getProject();
    this.newSprint.reporter = this._storageService.getUser();
    this.newSprint.status = SprintStatusEnum.IN_PROGRESS;
    this.newSprint.startDate = this._dateService.toTimestamp(new Date(this.newSprint.startDate));
    this.newSprint.endDate = this._dateService.toTimestamp(new Date(this.newSprint.endDate));

    let subscriptionUserAdd = this._sprintService.start(this.newSprint)
        .subscribe((response: IResponseType<ISprint>) => {
              if(response.status === "OK"){
                this._growler.growl('Sprint Started', GrowlerMessageType.Success);
                this.dialogRef.close();
                
                this._router.navigate(['/board']);
              }else{
                this.setFormError(true, "Unable to start sprint");
              }
    });
    this.subscriptions.push(subscriptionUserAdd);

  }

  onDurationChange(event: any){
    const duration = event.source.ngControl.value.split('W')[0];
    const startDate = this.startDateFormControl.value? this.startDateFormControl.value : new Date();
    const estimatedEndDate = new Date(startDate.setDate(startDate.getDate() + duration * 7));
    this.endDateFormControl.setValue(estimatedEndDate);
  }

  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }

  hasError(controlName: string, errorName: string) :boolean {
    return this.sprintForm.controls[controlName].hasError(errorName);
  }

}
