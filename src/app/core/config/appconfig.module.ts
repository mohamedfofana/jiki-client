import { AppConfigService } from './appconfig-service';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

export function init_app(appConfigService: AppConfigService) {
    return () => appConfigService.load();
}

@NgModule({
  imports: [ HttpClientModule ],
  providers: [
    { provide: APP_INITIALIZER,
       useFactory: init_app, 
       deps: [AppConfigService], 
       multi: true 
    }
  ]
})
export class AppConfigModule { }
