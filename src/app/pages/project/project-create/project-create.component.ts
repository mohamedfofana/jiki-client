import { LoggerService } from 'src/app/core/services/utils/logger.service';
import { ProjectStatusEnum } from './../../../shared/enum/project-status.enum';
import { IProject } from 'src/app/shared/model/project-model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AbstractOnDestroy } from 'src/app/pages/abstract.ondestroy';
import { ProjectService } from './../../../core/services/database/project.service';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent extends AbstractOnDestroy  implements OnInit {
  projectCreateForm: FormGroup;
  name =  new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  constructor(private _loggerService: LoggerService, private _projectService: ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.projectCreateForm = new FormGroup({
      name: this.name,
      description: this.description,
    })
  }

  onSubmit(): void {
    let name = this.name.value;
    let description = this.description.value;
   // const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    if (name && name.length> 0
        && description && description.length>0 ){
        let project=<IProject>this.projectCreateForm.value;
        project.creation_date = new Date();
        project.status = ProjectStatusEnum.CREATED;
        this._loggerService.log(project);
        this.createProject(project);
    }

  }
  createProject(project:IProject){
    let subscription = this._projectService.create(project)
    .subscribe((p: IProject) => {
      if(p){
        this._loggerService.log(p);
      }
    });
    this.subscriptions.push(subscription);
  }

}
