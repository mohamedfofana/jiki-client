import { CoreModule } from './core/core.module';
import { LoginModule } from './pages/login/login.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomErrorHandler } from './core/services/handler/custom-error-handler.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoginModule,
    HttpClientModule,    
    CoreModule.loadModuleWithProviders(),
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }

  ]
})
export class AppModule { }
