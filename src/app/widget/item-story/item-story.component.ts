import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/appconfig-service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { IStory } from 'src/app/shared/model/story.model';

@Component({
  selector: 'jiki-item-story',
  templateUrl: './item-story.component.html',
  styleUrls: ['./item-story.component.css']
})
export class ItemStoryComponent implements OnInit {
  @Input() story: IStory;

  constructor(private _appConfigService: AppConfigService,
              private _storageService: StorageService){
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
