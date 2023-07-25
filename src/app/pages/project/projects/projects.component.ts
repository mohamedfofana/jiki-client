import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogData } from 'src/app/shared/model/dialog-data.model';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { IProject } from 'src/app/shared/model/project.model';
import { ProjectAddEditDialogComponent } from '../project-add-edit-dialog/project-add-edit-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent extends AbstractOnDestroy implements OnInit, AfterViewInit {
  projects: IProject[] = [];
  emptyProject: IProject;
  currentProject: IProject;
  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<IProject>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formError: boolean;
  formErrorMessage: string;

  constructor(public dialog: MatDialog,
    public dialogConfirm: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _projectService: ProjectService,
    private _growler: GrowlerService) {
    super();
  }

  ngOnInit() {
    let subscriptionProjects = this._projectService.findAll()
      .subscribe((projects: IProject[]) => {
        if (projects) {
          this.projects = projects;
          this.dataSource.data = projects as IProject[];
        }
      });
    this.subscriptions.push(subscriptionProjects);
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

  addEditProject(project: IProject) {
    let dialogData: IDialogFormData<IProject> = {
      new: project?false:true,
      entity: project
    }
    this.setFormError(false, '');
    const dialogRef = this.dialog.open(ProjectAddEditDialogComponent, {
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

  delete(user: IProject) {
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
        let subscriptionProjectAdd = this._projectService.delete(user.id)
          .subscribe((response: IResponseType<IProject>) => {
            if (response.status === "OK") {
              this._growler.growl('The user was deleted', GrowlerMessageType.Danger);
              this.dataSource.data = this.dataSource.data.filter((value)=>{
                return value.id != user.id;
              });
            } else {
              this.setFormError(true, "Unable to delete the user");
            }
          });
        this.subscriptions.push(subscriptionProjectAdd);
      }
    });
  }

  setFormError(state: boolean, message: string) {
    this.formError = state;
    this.formErrorMessage = message;
  }

}
