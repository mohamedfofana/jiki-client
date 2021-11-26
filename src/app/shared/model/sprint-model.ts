import { IBacklog } from './backlog-model';
import { IUser } from './user-model';
import { IProject } from './project-model';
import { IStory } from './story-model';

export interface ISprint{
    id: number;
    title: string;
    description: string;
    workflow: string;
    status: string;
    appli_version: string;
    business_value: number;
    story_points: number;
    reporter:IUser;
    project:IProject;
    backlog:IBacklog;
    stories:[IStory];
    creation_date:Date;
    startDate:Date;
    endDate:Date;
    estimateDate:Date;
    updateDate:Date;
    // icon
    iconStatus:string;
    iconStatusColor:string;
}
