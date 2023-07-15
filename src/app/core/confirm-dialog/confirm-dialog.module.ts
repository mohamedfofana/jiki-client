import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '../modal/modal.module';
import { EnsureModuleLoadedOnceGuard } from '../ensure-module-loaded-once.guard';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MyMaterialModule } from 'src/app/pages/material/material-module';



@NgModule({
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  providers: [],
  imports: [
    MyMaterialModule,
    CommonModule
  ]
})
export class ConfirmDialogModule extends EnsureModuleLoadedOnceGuard {
// Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
constructor(@Optional() @SkipSelf() parentModule: ModalModule) {
  super(parentModule);
}

}
