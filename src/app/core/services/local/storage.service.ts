import { IUser } from '../../../shared/model/user.model';
import { Injectable } from '@angular/core';
import { IProject } from 'src/app/shared/model/project.model';
import * as CryptoJS from 'crypto-js';
import { ITeam } from 'src/app/shared/model/team.model';

enum StorageKeyEnum {
  TOKEN_ID_KEY = 'top_token',
  USER_KEY = 'user',
  PROJECT_KEY = 'project'
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly SECRECT_KEY = '!@JikI';

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.SECRECT_KEY).toString();
  }

  private decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.SECRECT_KEY).toString(CryptoJS.enc.Utf8);
  }

  storeItem(key: string, value:string){
    localStorage.setItem(key, value);
  }

  findItem(key: string){
    return localStorage.getItem(key);
  }

  itemExists(key:string): boolean{
    var keyValue = this.findItem(key);
    if(keyValue !== null && keyValue.length >0 ){
      return true;
    }
    return false;
  }

  getToken(): string{
    const token = this.findItem(StorageKeyEnum.TOKEN_ID_KEY) || '{}';
    return token;
  }

  getUser(): IUser {
    const userEncrypt = this.decrypt(this.findItem(StorageKeyEnum.USER_KEY) || '{}');
    const user = <IUser> JSON.parse(userEncrypt);

    return user;
  }

  getProject():IProject {
    const projectEncrypt = this.decrypt(this.findItem(StorageKeyEnum.PROJECT_KEY) || '{}');
    const project = <IProject> JSON.parse(projectEncrypt);

    return project;
  }

  getTeam():ITeam {
    const user = this.getUser();
    return user.team;
  }
  
  setProject(project: IProject) {
    this.storeItem(StorageKeyEnum.PROJECT_KEY, this.encrypt(JSON.stringify(project)));
  }

  login(user: IUser, token: string){
    this.storeItem(StorageKeyEnum.TOKEN_ID_KEY, token);
    this.storeItem(StorageKeyEnum.USER_KEY, this.encrypt(JSON.stringify(user)));
  }

  isUserInStorage(): boolean{
    if(this.itemExists(StorageKeyEnum.TOKEN_ID_KEY) && this.itemExists(StorageKeyEnum.USER_KEY)){
      return true;
    }
    return false;
  }

  logout(){
    Object.values(StorageKeyEnum).forEach(value => {
      localStorage.removeItem(value);
    });
  }
}
