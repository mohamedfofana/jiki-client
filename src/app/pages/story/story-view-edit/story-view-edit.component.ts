import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'ngx-editor';
import { Observable, mergeMap, map } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { StoryService } from 'src/app/core/services/database/story.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { StoryStatusEnum } from 'src/app/shared/enum/story-status.enum';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { IStory } from 'src/app/shared/model/story.model';
import { IUser } from 'src/app/shared/model/user.model';
import { SelectUserViewPipe } from 'src/app/shared/pipes/select-user-view.pipe';

declare var $: any;

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
  emptyUser:IUser;
  users$: Observable<IUser[]>;
  filteredAssignees$: Observable<IUser[]>;
  filteredReporters$: Observable<IUser[]>;
  idStory: number;
  showFiller = false;
  htmlContent = '';
  iconDeleteAssignee = 'close';
  iconDeleteReporter = 'close';

  constructor(private _route: ActivatedRoute,
              private _storyService: StoryService,
              private _userService: UserService,
              private _selectUserViewPipe: SelectUserViewPipe,
              public dialogConfirm: MatDialog,
              ) { }

   displayUserFn = (user: IUser) =>  {
    return user && this._selectUserViewPipe.transform(user);
   }

  ngOnInit(): void {
   const id:string = this._route.snapshot.paramMap.get("id") ?? '';
   this.idStory = parseInt(id);
   if(!Number.isNaN(this.idStory)){
  
    this._storyService.getStoryById(this.idStory)
          .pipe(
            map(
              s=>{
                this.story = s;
                this.newStory =s;
                this.editor = new Editor();
                this.story.longtitle = this.story.project.name+"-"+this.story.id;
              }
            ),
            mergeMap(() => 
              this.users$ = this._userService.findByProject(this.story.project.id)
            ),
            map(
              () =>   
              this.filteredReporters$ = this.filteredAssignees$ = this.users$
            )
          ).subscribe(

          );
          
   }
  }

  public filterAssignee(value: string ) {
    this.filteredAssignees$ = this._filterUsers(value);
  }

  public filterReporter(value: string) {
    this.filteredReporters$ = this._filterUsers(value);
  }

  private _filterUsers(value: string): Observable<IUser[]>{
    let filtered$ = this.users$.pipe(
      map(users => 
        users.filter( user => this._selectUserViewPipe.transform(user).includes(value)                  
        )
      ));

    return filtered$;
  }

  public resetReporter(event: any){
    console.log(event);
    this.filteredReporters$ = this.users$;
    this.newStory.reporter = this.emptyUser;
  }

  public resetAssignee(event: any){
    console.log(event);
    this.filteredAssignees$ = this.users$;
    this.newStory.assignedUser = this.emptyUser;
  }

  show(id: string){
    console.log('show = '+$(id));
    $('#'+id).show();
  }
  
  hide(id:string){
    console.log('hide = '+$(id));
    $('#'+id).hide();
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
    console.log('updateDescription()');
  }

  onSubmit(f:any): void {
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  delete(user: IUser) {
    const dialogData: IDialogData = {
      title: 'Please Confirm',
      body: 'Are you sure you want to delete the user?',
      okColor: 'warn',
      cancelButtonText: 'Cancel',
      okButtonText: 'Delete'
    };

    const dialogRef = this.dialogConfirm.open(ConfirmDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
     /* if (confirmed) {
        this.setFormError(false, '');
        let subscriptionProjectAdd = this._projectService.delete(user.id)
          .subscribe((response: IResponseType<IProject>) => {
            if (response.status === "OK") {
              this._growler.growl('The user was deleted', GrowlerMessageType.Danger);
              this.dataSource.data = this.dataSource.data.filter((value)=>{
                return value.id != user.id;
              });
            } else {
              this.setFormError(true, "Unable to delete the user");
            }
          });
        this.subscriptions.push(subscriptionProjectAdd);
      }*/
    });
  }
}
