import { ItemPageTitleComponent } from './item-page-title/item-page-title.component';
import { ItemStoryPreviewComponent } from './item-story-preview/item-story-preview.component';
import { ItemBoardComponent } from './item-board/item-board.component';
import { ItemStorySprintComponent } from './item-story-sprint/item-story-sprint.component';
import { ItemSprintComponent } from './item-sprint/item-sprint.component';
import { ItemProjectResumeComponent } from './item-project-resume/item-project-resume.component';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { ItemUserComponent } from './item-user/item-user.component';
import { ItemStoryComponent } from './item-story/item-story.component';
export class WidgetStatics {
  static components = [ ItemPageTitleComponent, 
                        ItemProjectResumeComponent,
                        ItemSprintComponent, 
                        ItemStorySprintComponent, 
                        ItemBoardComponent, 
                        ItemStoryPreviewComponent,
                        EditableInputComponent,
                        EditableInputComponent,
                        ItemUserComponent,
                        ItemStoryComponent ]
}
