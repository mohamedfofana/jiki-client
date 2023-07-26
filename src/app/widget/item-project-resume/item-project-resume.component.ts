import { IUser } from '../../shared/model/user.model';
import { StoryService } from '../../core/services/database/story.service';
import { IStory } from '../../shared/model/story.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { IProject } from 'src/app/shared/model/project.model';

import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { BacklogService } from 'src/app/core/services/database/backlog.service';
import { IBacklog } from 'src/app/shared/model/backlog.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jiki-item-project-resume',
  templateUrl: './item-project-resume.component.html',
  styleUrls: ['./item-project-resume.component.css']
})
export class ItemProjectResumeComponent extends AbstractOnDestroy implements OnInit, OnChanges {
  panelOpenState = true;
  @Input() isBacklog: boolean;
  @Input() filterText: string;
  @Input() filterAssignee: IUser[];
  @Input() filterReporter: IUser[];
  @Input() filterStatus: string[];
  @Input() project: IProject;
  @Input() projects: IProject[];
  @Input() currentSprint : ISprint;
  stories: IStory[];
  sprints: ISprint[];
  backlogs: IBacklog[];
  filteredStories: IStory[];
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(private _storyService: StoryService,
    private _backlogService: BacklogService) {
    super();
  }

  ngOnInit(): void {
    if(this.currentSprint){
      this.initStories();
      this.initBackog();
    }
  }
initBackog(){
  let subscriptionBacklogs = this._backlogService.getBacklogs()
      .subscribe((backlogs: IBacklog[]) => {
        if (backlogs) {
          this.backlogs = backlogs;
        }
      });
    this.subscriptions.push(subscriptionBacklogs);
}
  initStories(){
    let subscriptionStories = this._storyService.getStoriesOnBacklogsByProjectId(this.project.id)
      .subscribe((stories: IStory[]) => {
        console.log('initStories');
        if (stories) {
          this.stories = stories;
          this.filteredStories = stories;
        }
      });

    this.subscriptions.push(subscriptionStories);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChange();
  }
  onChange() {
    let currentStories = this.stories;
    if (this.filterText && this.filterText.trim().length>0) {
      currentStories = this.getChangeText(currentStories);
    }

    if (this.filterAssignee && this.filterAssignee.length>0) {
      currentStories = this.getChangeAssignee(currentStories);
    }

    if (this.filterReporter && this.filterReporter.length>0) {
      currentStories = this.getChangeReporter(currentStories);
    }

    if (this.filterStatus && this.filterStatus.length>0) {
      currentStories = this.getChangeStatus(currentStories);
    }

    if (currentStories) {
      this.filteredStories = currentStories;
    } else {
      this.filteredStories = this.stories;
    }
  }

  getChangeText(currentStories:IStory[]):IStory[] {
    return currentStories.filter(s => {
      return new String(s.title).includes(this.filterText);
    });
  }

  getChangeReporter(currentStories:IStory[]):IStory[] {
      let filtered = currentStories.filter(s => {
        let found:boolean = false;
        this.filterReporter.forEach(a => {
            if (s.reporter.id === a.id){
              found = true;
            }
          });
        return found;
      });
      return  filtered;
  }

  getChangeAssignee(currentStories:IStory[]):IStory[] {
      let filtered = currentStories.filter(s => {
        let found:boolean = false;
        this.filterAssignee.forEach(a => {
            if (s.assignedUser){
              if (s.assignedUser.id === a.id){
                found = true;
              }
            }
          });
        return found;
      });
      return filtered;
  }

  getChangeStatus(currentStories:IStory[]):IStory[] {
    let statuses = new String(this.filterStatus);
    let status:string[]=[];
    status = statuses.split(",");
    let filtered = currentStories.filter(s => {
      let found = false;
      status.forEach(stat => {
        if (s.status == stat) {
          found = true;
        }
      });
      return found;
    });
    return filtered
  }

  onContextMenu(event: MouseEvent, story: IStory) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = story;
    //this.contextMenu.menu!.resetActiveItem();
    this.contextMenu.openMenu();
  }

  moveToSprint() {
    let story =  this.contextMenu.menuData;
    story.project  = this.currentSprint.project;
    story.backlog = null;
    story.sprint = this.currentSprint;

    forkJoin([this._storyService.updateSprintAndBacklog(story)]).subscribe(
      s=>this.initStories()
    );
  }
  moveToBacklog(project: IProject) {
    let story =  this.contextMenu.menuData;
    story.project.id = project.id;
    story.backlog.id = project.backlog.id
    story.sprint = null;

    forkJoin([this._storyService.updateSprintAndBacklog(story)]).subscribe(
                                s=>this.initStories()
                                );
 }
}
