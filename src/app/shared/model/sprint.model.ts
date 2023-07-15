import { IBacklog } from './backlog.model';
import { IUser } from './user.model';
import { IProject } from './project.model';
import { IStory } from './story.model';

export interface ISprint{
    id: number;
    title: string;
    description: string;
    status: string;
    businessValue: number;
    reporter:IUser;
    project:IProject;
    stories:[IStory];
    creationDate:string;
    endDate:string;
    updateDate:string;
    // icon
    iconStatus:string;
    iconStatusColor:string;
}
