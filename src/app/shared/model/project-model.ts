import { IBacklog } from './backlog-model';
export interface IProject{
  id: number;
  backlog: IBacklog;
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
