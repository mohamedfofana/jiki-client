import { ItemPageTitleComponent } from './item-page-title/item-page-title.component';
import { ItemStoryPreviewComponent } from './item-story-preview/item-story-preview.component';
import { ItemSprintResumeComponent } from './item-sprint-resume/item-sprint-resume.component';
import { ItemBoardComponent } from './item-board/item-board.component';
import { ItemStorySprintComponent } from './item-story-sprint/item-story-sprint.component';
import { ItemSprintComponent } from './item-sprint/item-sprint.component';
import { ItemStoryBacklogComponent } from './item-story-backlog/item-story-backlog.component';
import { ItemProjectResumeComponent } from './item-project-resume/item-project-resume.component';
import { EditableInputComponent } from './editable-input/editable-input.component';
export class WidgetStatics {
  static components = [ ItemPageTitleComponent, 
                        ItemStoryBacklogComponent, 
                        ItemProjectResumeComponent, 
                        ItemSprintResumeComponent, 
                        ItemSprintComponent, 
                        ItemStorySprintComponent, 
                        ItemBoardComponent, 
                        ItemStoryPreviewComponent,
                        EditableInputComponent ]
}
