import { IUser } from '../../../shared/model/user.model';
import { Injectable } from '@angular/core';
import { IProject } from 'src/app/shared/model/project.model';
import * as CryptoJS from 'crypto-js';
import { ITeam } from 'src/app/shared/model/team.model';
import { UserRoleEnum } from 'src/app/shared/enum/user-role-enum';

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
    return this.getEncryptValue<IUser>(StorageKeyEnum.USER_KEY);
  }

  getProject():IProject {
    return this.getEncryptValue<IProject>(StorageKeyEnum.PROJECT_KEY);
  }

  getTeam():ITeam {
    const user = this.getUser();
    return user.team;
  }
  
  setProject(project: IProject) {
    console.log(project)
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

  getEncryptValue<T>(key: string): T {
    const item = this.findItem(key);
    const encryptValue = this.decrypt(item && item.length  > 0? item:'{}');
    const obj = <T> JSON.parse(encryptValue.length> 0? encryptValue:'{}');

    return obj;
  } 

}
