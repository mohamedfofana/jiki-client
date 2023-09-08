import { Injectable } from '@angular/core';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dataSource = new MatTableDataSource<Object>();
  constructor(private _dialog: MatDialog) {  }

  showPopupError(body: string) {
    const dialogData: IDialogData = {
      title: 'Warning !',
      body: body,
      okColor: 'warn',
      withActionButton: false,
      cancelButtonText: 'Ok',
      actionButtonText: 'Delete'
    };

    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: dialogData,
    });
  }

  showPopupComponent(obj: Object, component: ComponentType<any>) {
    let dialogData: IDialogFormData<Object> = {
      new: true,
      entity: obj
    }
    const dialogRef = this._dialog.open(component, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.new){
        let data = this.dataSource.data;
        data.push(result.entity);
        this.dataSource.data = data;
      }
    });
  }
}
