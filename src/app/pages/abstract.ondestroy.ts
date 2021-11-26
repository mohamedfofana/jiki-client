import { Subscription } from 'rxjs';
import { OnDestroy, Directive } from '@angular/core';
@Directive()
export abstract class AbstractOnDestroy implements OnDestroy{
  subscriptions: Subscription[]= [];
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      if(!x.closed) {
        x.unsubscribe();
      }
    });
  }
}
