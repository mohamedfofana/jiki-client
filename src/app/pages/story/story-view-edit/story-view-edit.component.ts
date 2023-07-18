import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GrowlerService } from 'src/app/core/growler/growler.service';
import { StoryService } from 'src/app/core/services/database/story.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { LoggerService } from 'src/app/core/services/utils/logger.service';
import { IStory } from 'src/app/shared/model/story.model';
import { LoginComponent } from '../../login/login.component';


@Component({
  selector: 'app-story-view-edit',
  templateUrl: './story-view-edit.component.html',
  styleUrls: ['./story-view-edit.component.css']
})
export class StoryViewEditComponent implements OnInit {
  // Form
  storyForm: FormGroup;
  // Controls
  titleFormControl: FormControl;
  descriptionFormControl: FormControl;
  businessValueFormControl: FormControl;
  statusFormControl: FormControl;
  typeFormControl: FormControl;
  prioritFormControl: FormControl;
  appliVersionFormControl: FormControl;
  workflowFormControl: FormControl;
  storyPointsFormControl: FormControl;
  startDateFormControl: FormControl;
  endDateFormControl: FormControl;
  creationDateFormControl: FormControl;
  updateDateFormControl: FormControl;
  projectFormControl: FormControl;
  sprintFormControl: FormControl;
  reporterFormControl: FormControl;
  assignedToFormControl: FormControl;
  backlogFormControl: FormControl;
  estimatedEndDateFormControl: FormControl;

  //
  story: IStory;
  idStory: number;
  showFiller = false;
  htmlContent = '';

  constructor(private _route: ActivatedRoute,
    private _storyService: StoryService,
    private _formBuilder: FormBuilder,
    private _storageService: StorageService,
    private _loggerService: LoggerService,
    private _growler: GrowlerService,

              ) { }

  ngOnInit(): void {
   this._loggerService.log('here');
   const id:string = this._route.snapshot.paramMap.get("id") ?? '';
   this.idStory = parseInt(id);
   if(!Number.isNaN(this.idStory)){
      this._storyService.getStoryById(this.idStory).subscribe(
        s=>{
          this.story = s;
          //this._loggerService.log(this.story);
          this.initForm();
        }
      );
   }
  }
  initControls(){
     // init controls
     this.titleFormControl = new FormControl(this.story.title, [Validators.required]);
     this.descriptionFormControl = new FormControl(this.story.description, [Validators.required]);
     this.statusFormControl = new FormControl(this.story.status, [Validators.required]);
     this.businessValueFormControl = new FormControl(this.story.businessValue, [Validators.required, Validators.pattern("^\d*[13579]$")]);
     this.projectFormControl = new FormControl(this._storageService.getProject().id);
  }
  initForm(){
    this.initControls();
   // create Form
    this.storyForm = this._formBuilder.group({
      title: this.titleFormControl,
      description: this.descriptionFormControl,
      status: this.statusFormControl,
      businessValue: this.businessValueFormControl,
      project: this._formBuilder.group({
        id: this.projectFormControl
      })
    });
  }
  onSubmitClick(): void {
  }
}
