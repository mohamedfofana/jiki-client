import { StoryStatusEnum } from './../../shared/enum/story-status.enum';
import { AppConfigService } from './../../core/services/local/appconfig-service';
import { Component, Input, OnInit } from '@angular/core';
import { IStory } from '../../shared/model/story-model';

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
    return this._appConfigService.getProperty("cdk.story.status." + this.story.status+".icon");
  }
  getTypeConfigKey(){
    return this._appConfigService.getProperty("cdk.story.type." + this.story.type+".icon");
  }
  getStatusColorConfigKey(){
    return this._appConfigService.getProperty("cdk.story.status." + this.story.status+".icon_color");
  }
  getTypeColorConfigKey(){
    return this._appConfigService.getProperty("cdk.story.type." + this.story.type+".icon_color");
  }
}
