import { IUser } from '../../../shared/model/user.model';
import { Injectable } from '@angular/core';
import { IProject } from 'src/app/shared/model/project.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  login(user: IUser, token: string){
    localStorage.setItem('top_token',token);
    localStorage.setItem('user',JSON.stringify(user));
  }
  isLoggedIn():boolean{
    if(this.itemExists('top_token') && this.itemExists('user')){
      return true;
    }
    return false;
  }
  getToken():string{
    return localStorage.getItem('top_token') || '{}';
  }
  getUser():IUser {
    var user = <IUser> JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  getProject():IProject {
    var user = this.getUser();
    return user.project;
  }
  storeItem(key: string, value:string){
    localStorage.setItem(key, value);
  }
  itemExists(key:string): boolean{
    var keyValue = localStorage.getItem(key);
    if(keyValue !== null && keyValue.length >0 ){
      return true;
    }
    return false;
  }
  logout(){
    localStorage.clear();
  }
}
