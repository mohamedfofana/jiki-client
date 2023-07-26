import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  private refreshedStories$ = new BehaviorSubject<boolean>(true);

  storiesNotifier(): BehaviorSubject<boolean>{
    return this.refreshedStories$;
  }

  notifyStories(){
    this.refreshedStories$.next(true);
  }
}
