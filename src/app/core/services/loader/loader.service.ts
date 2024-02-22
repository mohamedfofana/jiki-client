import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  readonly STARTED: string = 'started';
  readonly STOPPED: string = 'stopped';

  count: number = 0;
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  getSub() : Observable<boolean>{
    return this.isLoading$.asObservable();
  }

  requestStarted(){
    this.count++;
    if(this.count === 1){
      this.isLoading$.next(true);
    }

  }

  requestEndend(){
    this.count--;
    if(this.count <= 0){
      this.isLoading$.next(false);
    }    
  }

  resetLoader(){
    this.count = 0;
    this.isLoading$.next(false);
  }

}
