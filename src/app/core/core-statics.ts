import { SearchResultComponent } from './search/search-result/search-result.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LeftMenuComponent } from './layout/left-menu/left-menu.component';
import { TopMenuComponent } from './layout/top-menu/top-menu.component';
import { RouterModule } from '@angular/router';
import { AppConfigModule } from './config/appconfig.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GrowlerModule } from './growler/growler.module';
import { ModalModule } from './modal/modal.module';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { AuthService } from './services/database/auth.service';
import { BacklogService } from './services/database/backlog.service';
import { SprintService } from './services/database/sprint.service';
import { StoryService } from './services/database/story.service';
import { UserService } from './services/database/user.service';
import { StorageService } from './services/local/storage.service';
import { ProjectService } from './services/database/project.service';
import { AppConfigService } from './config/appconfig-service';
import { TeamService } from './services/database/team.service';
import { DatePipe } from '@angular/common';
import { JwtTokenService } from './services/database/jwt-token.service';
import { LoaderService } from './services/loader/loader.service';
import { LoaderComponent } from './loader/loader.component';
import { LoggerService } from './services/logger/logger.service';
import { NotifierService } from './services/notification/notifier.service';

export class CoreStatics {

  static components = [ TopMenuComponent,
                        LoaderComponent,
                        LeftMenuComponent,
                        FooterComponent,
                        SearchResultComponent ];

  static modules = [ RouterModule,
                     AppConfigModule,
                     ReactiveFormsModule,
                     GrowlerModule,
                     ModalModule,
                     ConfirmDialogModule
                   ];

  static services = [ BacklogService, 
                      StoryService, 
                      StorageService, 
                      UserService, 
                      AuthService, 
                      SprintService, 
                      LoggerService,
                      ProjectService,
                      AppConfigService, 
                      JwtTokenService,
                      TeamService,
                      LoaderService,
                      NotifierService];

  static pipes = [ DatePipe ];

}
