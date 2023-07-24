import { SprintService } from './../../../core/services/database/sprint.service';
import { map, mergeMap } from 'rxjs';
import { IProject } from '../../../shared/model/project.model';
import { ProjectService } from './../../../core/services/database/project.service';
import { ISprint } from '../../../shared/model/sprint.model';
import { StorageService } from './../../../core/services/local/storage.service';
import { IStory } from '../../../shared/model/story.model';
import { Component, OnInit } from '@angular/core';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { IUser } from 'src/app/shared/model/user.model';
import { AppConfigService } from 'src/app/core/config/appconfig-service';
import { UserService } from 'src/app/core/services/database/user.service';
import { FormControl } from '@angular/forms';
import { StoryStatusEnum } from 'src/app/shared/enum/story-status.enum';

@Component({
  selector: 'app-backlogs',
  templateUrl: './backlogs.component.html',
  styleUrls: ['./backlogs.component.css']
})
export class BacklogsComponent extends AbstractOnDestroy implements OnInit {
  currentSprint: ISprint;
  sprints: ISprint[];
  projects: IProject[];
  stories: IStory[];
  filterText:string;
  filterAssignee:IUser[];
  filterReporter:IUser[];
  filterStatus:string[];
  selectedAssignee:IUser[]=[];
  selectedReporter:IUser[]=[];
  selectedStatus:string[]=[];

  selectReporterFormControl =  new FormControl<IUser[] >([]);
  selectAssigneeFormControl = new FormControl<IUser[]>([]);
  selectStatusFormControl = new FormControl<string[]>([]);

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
    private _projectService: ProjectService,
    private _userService: UserService,
    private _storageService: StorageService) {
      super();
    }

  ngOnInit() {
    let projectId = this._storageService.getProject().id;
    let subscriptionSprint$ = this._sprintService.getCurrentByProjectId(projectId)
                              .pipe(
                                map((sprint: ISprint) => {
                                    if(sprint){
                                      this.currentSprint = sprint;
                                    }
                                  }
                                ),
                                mergeMap(() => 
                                  this._projectService.findAll()
                                ),
                                map((projects: IProject[]) => {
                                  if(projects){
                                    this.projects = projects.sort((s1, s2)=> s1.name>s2.name? -1:1);
                                    this.projects.forEach(project=> {
                                      project.iconStatus = this.getStatusConfigKey(project);
                                      project.iconStatusColor = this.getStatusColorConfigKey(project);
                                    });
                                  }
                                }),
                                mergeMap(()=> 
                                  this._userService.findAll()
                                )
                              ).subscribe((users: IUser[]) => {
                                if(users){
                                  this.assigneeList = users.sort((s1, s2)=> s1.lastname>s2.lastname? -1:1);
                                  this.reporterList = this.assigneeList;
                                }
                              });

    this.subscriptions.push(subscriptionSprint$);
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
  getStatusConfigKey(project:IProject){
    return this._appConfigService.getProperty("cdk.sprint.status." + project.status +".icon");
  }
  getStatusColorConfigKey(project:IProject){
    return this._appConfigService.getProperty("cdk.sprint.status." + project.status +".icon.color");
  }
      }
