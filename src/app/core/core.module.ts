import { MyMaterialModule } from './../pages/material/material-module';
import { CoreStatics } from './core-statics';
import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';


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

  providers: [ CoreStatics.pipes ] 
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
  static loadModuleWithProviders(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [ CoreStatics.services ]
    };
  }
}
