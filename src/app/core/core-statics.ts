import { SearchResultComponent } from './search/search-result/search-result.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LeftMenuComponent } from './layout/left-menu/left-menu.component';
import { TopMenuComponent } from './layout/top-menu/top-menu.component';
import { RouterModule } from '@angular/router';
import { AppConfigModule } from './config/app-config.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GrowlerModule } from './growler/growler.module';
import { ModalModule } from './modal/modal.module';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { OverlayModule } from './overlay/overlay.module';
import { LoggerService } from './services/utils/logger.service';
import { AuthService } from './services/database/auth.service';
import { BacklogService } from './services/database/backlog.service';
import { SprintService } from './services/database/sprint.service';
import { StoryService } from './services/database/story.service';
import { UserService } from './services/database/user.service';
import { StorageService } from './services/local/storage.service';
import { EventBusService } from './services/utils/event-bus.service';
import { ProjectService } from './services/database/project.service';
import { AppConfigService } from './services/local/appconfig-service';
import { TeamService } from './services/database/team.service';
import { DatePipe } from '@angular/common';
export class CoreStatics {
  static components = [TopMenuComponent,
      LeftMenuComponent,
      FooterComponent,
      SearchResultComponent];
  static modules = [RouterModule,
      AppConfigModule,
      ReactiveFormsModule,
      GrowlerModule,
      OverlayModule,
      ModalModule,
      ConfirmDialogModule];
  static services = [BacklogService, StoryService,StorageService, UserService, EventBusService,
      AuthService, SprintService,LoggerService,ProjectService,AppConfigService, TeamService];
  static pipes = [DatePipe];
}
