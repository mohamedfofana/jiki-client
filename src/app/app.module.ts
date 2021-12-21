import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { LoginModule } from './pages/login/login.module';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfigService } from './core/services/local/appconfig-service';

export function init_app(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoginModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
