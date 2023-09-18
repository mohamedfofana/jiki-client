import { ITeam } from './team.model';
export interface IUser{
  id:number;
  team:ITeam;
  email: string;
  firstname:string;
  lastname:string;
  username:string;
  password:string;
  role:string;
  subrole:string;
  status:string;
  creationDate:string;
  updateDate:string;
}
