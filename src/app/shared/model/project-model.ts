import { IBacklog } from './backlog-model';
import { ITeam } from './team-model';
export interface IProject{
  id: number;
  backlog: IBacklog;
  team: ITeam;
  name: string;
  description: string;
  status: string;
  creation_date:Date;
  endDate:Date;
  updateDate:Date;
  // icon
  iconStatus:string;
  iconStatusColor:string;
}
