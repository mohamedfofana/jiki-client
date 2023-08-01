import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../model/user.model';

@Pipe({
  name: 'selectUserView'
})
export class SelectUserViewPipe implements PipeTransform {

  transform(user: IUser): string {
    return user && user.firstname + ' ' + user.lastname;
  }

}
