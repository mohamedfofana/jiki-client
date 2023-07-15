import { MyMaterialModule } from './../pages/material/material-module';
import { CoreStatics } from './core-statics';
import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [ CoreStatics.components],
  imports: [
    CommonModule,
    MyMaterialModule,
    CoreStatics.modules],

  exports: [
    CoreStatics.modules,
    CoreStatics.components
],

  providers: [ CoreStatics.pipes,
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
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [ CoreStatics.services ]
    };
  }
}
