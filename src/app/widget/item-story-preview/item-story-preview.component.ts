import { AppConfigService } from './../../core/services/local/appconfig-service';
import { IStory } from '../../shared/model/story.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jiki-item-story-preview',
  templateUrl: './item-story-preview.component.html',
  styleUrls: ['./item-story-preview.component.css']
})
export class ItemStoryPreviewComponent implements OnInit{
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
