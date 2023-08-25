import { StoryStatusEnum } from './../../shared/enum/story-status.enum';
import { AppConfigService } from '../../core/config/appconfig-service';
import { Component, Input, OnInit } from '@angular/core';
import { IStory } from '../../shared/model/story.model';

@Component({
  selector: 'jiki-item-story-backlog',
  templateUrl: './item-story-backlog.component.html',
  styleUrls: [ './item-story-backlog.component.css' ]
})
export class ItemStoryBacklogComponent implements OnInit{
  @Input() story: IStory;
  constructor(private _appConfigService: AppConfigService){
  }
  ngOnInit(): void {
    this.story.longtitle = this.story.project.name+"-"+this.story.id;
    this.story.iconType = this.getTypeConfigKey();
    this.story.iconStatus = this.getStatusConfigKey();
    this.story.iconTypeColor = this.getTypeColorConfigKey();
    this.story.iconStatusColor = this.getStatusColorConfigKey();
  }

  getStatusConfigKey(){
    return this._appConfigService.getStoryStatusIcon(this.story.status);
  }
  getTypeConfigKey(){
    return this._appConfigService.getStoryTypeIcon(this.story.type);
  }
  getStatusColorConfigKey(){
    return this._appConfigService.getStoryStatusIconColor(this.story.status);
  }
  getTypeColorConfigKey(){
    return this._appConfigService.getStoryTypeIconColor(this.story.type);
  }
}
