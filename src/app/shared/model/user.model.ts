import { IProject } from './project.model';
import { ITeam } from './team.model';
export interface IUser{
  id:number;
  team:ITeam;
  project:IProject;
  email: string;
  firstname:string;
  lastname:string;
  username:string;
  password:string;
  role:string;
  status:string;
  creationDate:string;
  updateDate:string;
}
