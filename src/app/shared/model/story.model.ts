import { IProject } from './project.model';
import { IUser } from './user.model';
import { IBacklog } from './backlog.model';
import { ISprint } from './sprint.model';
import { ITeam } from './team.model';

export interface IStory{
    id: number;
    shortTitle: string;
    title: string;
    description: string;
    workflow: string;
    type: string;
    status: string;
    scope: string;
    priority: string;
    appliVersion: string;
    businessValue: number;
    storyPoints: number;
    reporter:IUser;
    assignedTeam:ITeam | null;
    sprint:ISprint| null;
    project:IProject;
    backlog:IBacklog | null ;
    assignedUser:IUser;
    creationDate:string;
    startDate:string;
    endDate:string;
    estimatedEndDate:string;
    updateDate:string;
    // Calculated attributes
    longtitle: string;
    iconStatus:string;
    iconType:string;
    iconStatusColor:string;
    iconTypeColor:string;
}
