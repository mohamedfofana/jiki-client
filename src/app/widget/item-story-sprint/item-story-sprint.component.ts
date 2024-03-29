import { AppConfigService } from '../../core/config/appconfig-service';
import { IStory } from '../../shared/model/story.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jiki-item-story-sprint',
  templateUrl: './item-story-sprint.component.html',
  styleUrls: ['./item-story-sprint.component.css']
})
export class ItemStorySprintComponent implements OnInit {
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
