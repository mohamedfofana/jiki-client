import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { StoryService } from 'src/app/core/services/database/story.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { IProject } from 'src/app/shared/model/project.model';
import { IStory } from 'src/app/shared/model/story.model';
import { IUser } from 'src/app/shared/model/user.model';

@Component({
  selector: 'jiki-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends AbstractOnDestroy implements OnInit {
  currentUser: IUser;
  project: IProject;
  users$: Observable<IUser[]>;
  stories$: Observable<IStory[]>;

  constructor(
              private _storageService: StorageService,
              private _userService: UserService,
              private _storyService: StoryService
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser = this._storageService.getUser();
    this.project = this._storageService.getProject();
    this.users$ = this._userService.findByTeam(this.currentUser.team.id)
    this.stories$ = this._storyService.findByReporter(this.currentUser.id);
  }
}
