import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  readonly SECRECT_KEY = '!@JikI';
  readonly DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
  constructor(
                private _datePipe: DatePipe
             ) { }
             
 currentTimestamp(): string{
    return <string> this._datePipe.transform(new Date(), this.DATETIME_FORMAT);
 }

 toTimestamp(value: Date): string{
    return <string> this._datePipe.transform(value, this.DATETIME_FORMAT);
 }
}