import { IUser } from '../../../shared/model/user.model';
import { StoryStatusEnum } from './../../../shared/enum/story-status.enum';
import { UserService } from './../../../core/services/database/user.service';
import { SprintService } from './../../../core/services/database/sprint.service';
import { ISprint } from '../../../shared/model/sprint.model';
import { AppConfigService } from '../../../core/config/appconfig-service';
import { Component, OnInit } from '@angular/core';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { SprintAddEditDialogComponent } from '../sprint-add-edit-dialog/sprint-add-edit-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IProject } from 'src/app/shared/model/project.model';
import { map, mergeMap } from 'rxjs';

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

  selectReporterFormControl =  new FormControl<IUser[]>([]);
  selectAssigneeFormControl = new FormControl<IUser[]>([]);
  selectStatusFormControl = new FormControl<string[]>([]);

  project: IProject;
  assigneeList: IUser[];
  reporterList: IUser[];
  emptySprint: ISprint;
  dataSource = new MatTableDataSource<ISprint>();

  statusList: string[] = [
    StoryStatusEnum.TODO,
    StoryStatusEnum.IN_PROGRESS,
    StoryStatusEnum.DONE,
    StoryStatusEnum.BLOCKED
  ];
  constructor(public dialog: MatDialog,private _appConfigService: AppConfigService,
    private _sprintService: SprintService,
    private _userService: UserService,
    private _storageService: StorageService) {
      super();
    }

  ngOnInit() {
    this.project = this._storageService.getProject();
    let subscriptionSprint$ = this._sprintService.getSprintsByProjectId(this.project.id)
                              .pipe(
                                map((sprints: ISprint[]) => {
                                  if(sprints){
                                    this.sprints = sprints.sort((s1, s2)=> s1.id>s2.id? -1:1);
                                    this.sprints.forEach(sprint=> {
                                      sprint.iconStatus = this.getStatusConfigKey(sprint);
                                      sprint.iconStatusColor = this.getStatusColorConfigKey(sprint);
                                    });
                                  }
                                }),
                                mergeMap(() => 
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
  getStatusConfigKey(sprint:ISprint){
    return this._appConfigService.getProperty("cdk.sprint.status." + sprint.status +".icon");
  }
  getStatusColorConfigKey(sprint:ISprint){
    return this._appConfigService.getProperty("cdk.sprint.status." + sprint.status +".icon.color");
  }
  addEditProject(project: ISprint) {
    let dialogData: IDialogFormData<ISprint> = {
      new: project?false:true,
      entity: project
    }
    const dialogRef = this.dialog.open(SprintAddEditDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.new){
        let data = this.dataSource.data;
        data.push(result.entity);
        this.dataSource.data = data;
      }
    });
  }
}
