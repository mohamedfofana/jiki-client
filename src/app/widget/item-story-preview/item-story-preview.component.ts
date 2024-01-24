import { StorageService } from 'src/app/core/services/local/storage.service';
import { AppConfigService } from '../../core/config/appconfig-service';
import { IStory } from '../../shared/model/story.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jiki-item-story-preview',
  templateUrl: './item-story-preview.component.html',
  styleUrls: ['./item-story-preview.component.css']
})
export class ItemStoryPreviewComponent implements OnInit{
  @Input() story: IStory;
  constructor(private _appConfigService: AppConfigService,
              private _storageService: StorageService
              ){
  }
  ngOnInit(): void {
    this.story.longtitle = this._storageService.getProject().shortname+"-"+this.story.id;
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
