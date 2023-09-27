import { Component, Input } from '@angular/core';
import { UserJobTitleConstant } from 'src/app/shared/constants/user-jobTitle.constant';
import { IUser } from 'src/app/shared/model/user.model';

@Component({
  selector: 'jiki-item-user',
  templateUrl: './item-user.component.html',
  styleUrls: ['./item-user.component.css']
})
export class ItemUserComponent {
  @Input() user: IUser;
  jobTitles = UserJobTitleConstant;
}
