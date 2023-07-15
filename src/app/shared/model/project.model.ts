import { IBacklog } from './backlog.model';
import { ITeam } from './team.model';
export interface IProject{
  id: number;
  backlog: IBacklog;
  team: ITeam;
  name: string;
  description: string;
  status: string;
  creationDate:string;
  endDate:string;
  updateDate:string;
  // icon
  iconStatus:string;
  iconStatusColor:string;
}
