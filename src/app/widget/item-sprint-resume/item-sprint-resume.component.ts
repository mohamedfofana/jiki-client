import { IUser } from '../../shared/model/user.model';

import { LoggerService } from './../../core/services/utils/logger.service';
import { StoryService } from './../../core/services/database/story.service';
import { IStory } from '../../shared/model/story.model';
import { ISprint } from '../../shared/model/sprint.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';


@Component({
  selector: 'jiki-item-sprint-resume',
  templateUrl: './item-sprint-resume.component.html',
  styleUrls: ['./item-sprint-resume.component.css']
})
export class ItemSprintResumeComponent extends AbstractOnDestroy implements OnInit, OnChanges {
  panelOpenState = true;
  @Input() filterText: string;
  @Input() filterAssignee: IUser[];
  @Input() filterReporter: IUser[];
  @Input() filterStatus: string[];
  @Input() sprint: ISprint;
  stories: IStory[];
  filteredStories: IStory[];
  constructor(private _storyService: StoryService,
    private _loggerService: LoggerService) {
    super();
  }

  ngOnInit(): void {
    let subscription = this._storyService.getStoriesBySprint(this.sprint.id)
      .subscribe((stories: IStory[]) => {
        if (stories) {
          this.stories = stories;
          this.filteredStories = stories;
        }
      });
    this.subscriptions.push(subscription);
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

    // if (this.filterStatus && this.filterStatus!="None" && this.filterStatus!="") {
    //   currentStories = this.getChangeStatus(currentStories);
    // }

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
            if (s.assignedUser.id === a.id){
              found = true;
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
}
