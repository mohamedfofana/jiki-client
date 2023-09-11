import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { TeamService } from 'src/app/core/services/database/team.service';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { ITeam } from 'src/app/shared/model/team.model';
import { TeamAddEditDialogComponent } from '../team-add-edit-dialog/team-add-edit-dialog.component';
import { TeamStatusConstant } from 'src/app/shared/constants/team-status.constant';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent  extends AbstractOnDestroy implements OnInit, AfterViewInit {
  teams: ITeam[] = [];
  emptyTeam: ITeam;
  displayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<ITeam>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formError: boolean;
  formErrorMessage: string;
  statuses = TeamStatusConstant;

  constructor(public dialog: MatDialog,
    public dialogConfirm: MatDialog,
    private _projectService: TeamService,
    private _growler: GrowlerService) {
    super();
  }

  ngOnInit() {
    let subscriptionTeams = this._projectService.findAll()
      .subscribe((teams: ITeam[]) => {
        if (teams) {
          this.teams = teams;          
          this.dataSource.data = teams as ITeam[];
        }
      });
    this.subscriptions.push(subscriptionTeams);
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

  addEditTeam(team: ITeam) {
    let dialogData: IDialogFormData<ITeam> = {
        new: team?false:true,
        entity: team
    }
    this.setFormError(false, '');

    const dialogRef = this.dialog.open(TeamAddEditDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.entity){
        const newTeam: ITeam = result.entity;
        let data = this.dataSource.data;
        if (result.new){
          data.push(newTeam);
          this.dataSource.data = data;
        }else {
          this.dataSource.data.forEach( t => {
            if (t.id === newTeam.id) {
              t.name = newTeam.name;
              t.description = newTeam.description;
              t.status = newTeam.status;
            }
          });
          this.dataSource.data = data;
        }
      }
    });
  }

  delete(user: ITeam) {
    const dialogData: IDialogData = {
      title: 'Please Confirm',
      body: 'Are you sure you want to delete the team?',
      okColor: 'warn',
      withActionButton: true,
      cancelButtonText: 'Cancel',
      actionButtonText: 'Delete'
    };

    const dialogRef = this.dialogConfirm.open(ConfirmDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.setFormError(false, '');
        let subscriptionTeamAdd = this._projectService.delete(user.id)
          .subscribe((response: IResponseType<ITeam>) => {
            if (response.status === "OK") {
              this._growler.growl('The project was deleted', GrowlerMessageType.Danger);
              this.dataSource.data = this.dataSource.data.filter((value)=>{
                return value.id != user.id;
              });
            } else {
              this.setFormError(true, "Unable to delete the team");
            }
          });
        this.subscriptions.push(subscriptionTeamAdd);
      }
    });
  }

  setFormError(state: boolean, message: string) {
    this.formError = state;
    this.formErrorMessage = message;
  }

}
