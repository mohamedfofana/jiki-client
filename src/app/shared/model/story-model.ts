import { IProject } from './project-model';
import { IUser } from './user-model';
import { IBacklog } from './backlog-model';
import { ISprint } from './sprint-model';
import { ITeam } from './team-model';

export interface IStory{
    id: number;
    title: string;
    description: string;
    workflow: string;
    type: string;
    status: string;
    priority: string;
    appliVersion: string;
    businessValue: number;
    storyPoints: number;
    reporter:IUser;
    assignedTeam:ITeam;
    sprint:ISprint| null;
    project:IProject;
    backlog:IBacklog | null ;
    assignedUser:IUser;
    creationDate:Date;
    startDate:Date;
    endDate:Date;
    estimateDate:Date;
    updateDate:Date;
    // Calculated attributes
    longtitle: string;
    iconStatus:string;
    iconType:string;
    iconStatusColor:string;
    iconTypeColor:string;
}
