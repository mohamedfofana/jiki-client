import { UserService } from './services/database/user.service';
import { AppConfigService } from './services/local/appconfig-service';
import { MyMaterialModule } from './../pages/material/material-module';
import { ProjectService } from './services/database/project.service';
import { LoggerService } from './services/utils/logger.service';
import { StorageService } from './services/local/storage.service';
import { StoryService } from './services/database/story.service';
import { CoreStatics } from './core-statics';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { GrowlerModule } from './growler/growler.module';
import { SorterService } from './services/utils/sorter.service';
import { FilterService } from './services/utils/filter.service';
import { DataService } from './services/utils/data.service';
import { TrackByService } from './services/utils/trackby.service';
import { AuthService } from './services/database/auth.service';
import { DialogService } from './services/utils/dialog.service';
import { EventBusService } from './services/utils/event-bus.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ModalModule } from './modal/modal.module';
import { OverlayModule } from './overlay/overlay.module';
import { AppConfigModule } from './config/app-config.module';
import { SprintService } from './services/database/sprint.service';
import { BacklogService } from './services/database/backlog.service';
import { TeamService } from './services/database/team.service';


@NgModule({
  declarations: [ CoreStatics.components],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    GrowlerModule,
    ModalModule,
    MyMaterialModule,
    AppConfigModule,
    OverlayModule],

  exports: [
    RouterModule,
    AppConfigModule,
    ReactiveFormsModule,
    GrowlerModule,
    OverlayModule,
    ModalModule,
    CoreStatics.components
],

  providers: [ BacklogService, StoryService,StorageService, UserService,
               SorterService, FilterService, DataService,
               TrackByService, DialogService, AuthService,
               EventBusService, SprintService,LoggerService,
               ProjectService,AppConfigService, TeamService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ] // these should be singleton
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
