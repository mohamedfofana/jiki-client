import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { IUser } from 'src/app/shared/model/user.model';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { UserAddEditDialogComponent } from '../user-add-edit-dialog/user-add-edit-dialog.component';

@Component({
  selector: 'jiki-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends AbstractOnDestroy implements OnInit, AfterViewInit {
  users: IUser[] = [];
  emptyUser: IUser;
  currentUser: IUser;
  displayedColumns: string[] = ['id', 'username', 'firstname', 'lastname', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formError: boolean;
  formErrorMessage: string;

  constructor(public dialog: MatDialog,
    public dialogConfirm: MatDialog,
    private _userService: UserService,
    private _growler: GrowlerService) {
    super();
  }

  ngOnInit() {
    let subscriptionUsers = this._userService.findAll()
      .subscribe((users: IUser[]) => {
        if (users) {
          this.users = users;
          this.dataSource.data = users as IUser[];
        }
      });
    this.subscriptions.push(subscriptionUsers);
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addEditUser(user: IUser) {
    let dialogData: IDialogFormData<IUser> = {
      new: user?false:true,
      entity: user
    }
    this.setFormError(false, '');
    const dialogRef = this.dialog.open(UserAddEditDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.new){
        let data = this.dataSource.data;
        data.push(result.entity);
        this.dataSource.data = data;
      }
    });
  }

  delete(user: IUser) {
    const dialogData: IDialogData = {
      title: 'Please Confirm',
      body: 'Are you sure you want to delete the user?',
      okColor: 'warn',
      cancelButtonText: 'Cancel',
      okButtonText: 'Delete'
    };

    const dialogRef = this.dialogConfirm.open(ConfirmDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.setFormError(false, '');
        let subscriptionUserAdd = this._userService.delete(user.id)
          .subscribe((response: IResponseType<IUser>) => {
            if (response.status === "OK") {
              this._growler.growl('The user was deleted', GrowlerMessageType.Danger);
              this.dataSource.data = this.dataSource.data.filter((value)=>{
                return value.id != user.id;
              });
            } else {
              this.setFormError(true, "Unable to delete the user");
            }
          });
        this.subscriptions.push(subscriptionUserAdd);
      }
    });
  }

  setFormError(state: boolean, message: string) {
    this.formError = state;
    this.formErrorMessage = message;
  }

}
