import { ITeam } from './team.model';
export interface IUser{
  id:number;
  team:ITeam;
  email: string;
  jobTitle:string;
  firstname:string;
  lastname:string;
  username:string;
  password:string;
  role:string;
  status:string;
  creationDate:string;
  updateDate:string;
}
