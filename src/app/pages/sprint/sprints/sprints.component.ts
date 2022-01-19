import { IUser } from '../../../shared/model/user.model';
import { StoryStatusEnum } from './../../../shared/enum/story-status.enum';
import { UserService } from './../../../core/services/database/user.service';
import { SprintService } from './../../../core/services/database/sprint.service';
import { ISprint } from '../../../shared/model/sprint.model';
import { AppConfigService } from './../../../core/services/local/appconfig-service';
import { LoggerService } from './../../../core/services/utils/logger.service';
import { Component, OnInit } from '@angular/core';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/local/storage.service';

@Component({
  selector: 'jiki-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent extends AbstractOnDestroy implements OnInit {
  sprints: ISprint[];
  filterText:string;
  filterAssignee:IUser[];
  filterReporter:IUser[];
  filterStatus:string[];
  selectedAssignee:IUser[]=[];
  selectedReporter:IUser[]=[];
  selectedStatus:string[]=[];

  selectReporterFormControl =  new FormControl([]);
  selectAssigneeFormControl = new FormControl([]);
  selectStatusFormControl = new FormControl([]);

  assigneeList: IUser[];
  reporterList: IUser[];

  statusList: string[] = [
    StoryStatusEnum.TODO,
    StoryStatusEnum.IN_PROGRESS,
    StoryStatusEnum.DONE,
    StoryStatusEnum.BLOCKED
  ];
  constructor(private _appConfigService: AppConfigService,
    private _sprintService: SprintService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _loggerService: LoggerService) {
      super();
    }

  ngOnInit() {
    let projectId = this._storageService.getUser().project.id;
    let subscriptionSprint = this._sprintService.getSprintsByProjectId(projectId)
    .subscribe((sprints: ISprint[]) => {
      if(sprints){
        this.sprints = sprints.sort((s1, s2)=> s1.startDate>s2.startDate? -1:1);
        this.sprints.forEach(sprint=> {
          sprint.iconStatus = this.getStatusConfigKey(sprint);
          sprint.iconStatusColor = this.getStatusColorConfigKey(sprint);
        });
      }
    });
    let subscriptionUser = this._userService.findAll()
    .subscribe((users: IUser[]) => {
      if(users){
        this.assigneeList = users.sort((s1, s2)=> s1.lastname>s2.lastname? -1:1);
        this.reporterList = this.assigneeList;
      }
    });
    this.subscriptions.push(subscriptionSprint);
    this.subscriptions.push(subscriptionUser);
  }

  filterTextChanged(event: any) {
    let value = event.target.value;
    this.filterText = value;
  }

  filterStatusChanged(event: any) {
    let value = event.value;
    if (value){
      this.filterStatus = value;
    }
  }

  filterAssigneeChanged(event: any) {
    this.filterAssignee = this.selectAssigneeFormControl.value as IUser[];;
  }

  filterReporterChanged(event: any) {
       this.filterReporter = this.selectReporterFormControl.value as IUser[];;
  }

  onReporterRemoved(reporter: IUser) {
    const reporters = this.selectReporterFormControl.value as IUser[];
    this.filterReporter = reporters.filter(r => r.id != reporter.id);
    this.selectReporterFormControl.setValue(this.filterReporter);
  }

  onAssigneeRemoved(assignee: IUser) {
    const assignees = this.selectAssigneeFormControl.value as IUser[];
    this.filterAssignee = assignees.filter(r => r.id != assignee.id);
    this.selectAssigneeFormControl.setValue(this.filterAssignee);
  }

  onStatusRemoved(status: string) {
    const statuses = this.selectStatusFormControl.value as string[];
    this.filterStatus = statuses.filter(st => st !== status);
    this.selectStatusFormControl.setValue(this.filterStatus);
  }
  getStatusConfigKey(sprint:ISprint){
    return this._appConfigService.getProperty("cdk.sprint.status." + sprint.status +".icon");
  }
  getStatusColorConfigKey(sprint:ISprint){
    return this._appConfigService.getProperty("cdk.sprint.status." + sprint.status +".icon.color");
  }

}
