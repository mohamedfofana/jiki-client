import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'ngx-editor';
import { Observable } from 'rxjs';
import { StoryService } from 'src/app/core/services/database/story.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { StoryStatusEnum } from 'src/app/shared/enum/story-status.enum';
import { IStory } from 'src/app/shared/model/story.model';
import { IUser } from 'src/app/shared/model/user.model';
import { SelectUserViewPipe } from 'src/app/shared/pipes/select-user-view.pipe';


@Component({
  selector: 'app-story-view-edit',
  templateUrl: './story-view-edit.component.html',
  styleUrls: ['./story-view-edit.component.css']
})
export class StoryViewEditComponent implements OnInit, OnDestroy {
  editor: Editor;
  // Editale 
  newStory: IStory;
  enumKeys = Object.keys;
  statuses = StoryStatusEnum;
  story: IStory;
  user:IUser;
  users$: Observable<IUser[]>;
  idStory: number;
  showFiller = false;
  htmlContent = '';

  constructor(private _route: ActivatedRoute,
              private _storyService: StoryService,
              private _userService: UserService,
              private _selectUserViewPipe: SelectUserViewPipe
              ) { }

   displayUserFn = (user: IUser) =>  {
    return user && this._selectUserViewPipe.transform(user);
   }

  ngOnInit(): void {
   const id:string = this._route.snapshot.paramMap.get("id") ?? '';
   this.idStory = parseInt(id);
   if(!Number.isNaN(this.idStory)){
      this._storyService.getStoryById(this.idStory).subscribe(
        s=>{
          this.story = s;
          this.newStory =s;
          //this._loggerService.log(this.story);
          this.editor = new Editor();
          this.story.longtitle = this.story.project.name+"-"+this.story.id;
        }
      );
      // get users in projects
      this.users$ = this._userService.findAll();
   }
  }

  onLostFocus(event: any){
    // Update story
    const field = event.target.name;
    const value = event.target.value;
    console.log('onLostFocus : ' +field);
    console.log(' newStory =' + this.newStory.title);
    console.log(' old =' + this.story.title);
  }

  updateDescription(){

  }

  onSubmit(f:any): void {
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
