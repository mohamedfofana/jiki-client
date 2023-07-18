import { IUser } from '../../../shared/model/user.model';
import { Injectable } from '@angular/core';
import { IProject } from 'src/app/shared/model/project.model';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly TOKEN_ID_KEY = 'top_token';
  readonly USER_KEY = 'user';
  readonly secret_key = '!@JikI';
  
  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secret_key).toString();
  }

  private decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, this.secret_key).toString(CryptoJS.enc.Utf8);
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
    const token = this.findItem(this.TOKEN_ID_KEY) || '{}';
    return this.decrypt(token);
  }

  getUser(): IUser {
    const userEncrypt = this.decrypt(this.findItem(this.USER_KEY) || '{}');
    const user = <IUser> JSON.parse(userEncrypt);

    return user;
  }

  getProject():IProject { 
    const user = this.getUser();
    return user.project;
  }

  login(user: IUser, token: string){
    this.storeItem(this.TOKEN_ID_KEY, this.encrypt(token));
    this.storeItem(this.USER_KEY, this.encrypt(JSON.stringify(user)));
  }

  isLoggedIn(): boolean{
    // TODO rewrite 
    if(this.itemExists(this.TOKEN_ID_KEY) && this.itemExists(this.USER_KEY)){
      // if() token valid and not expired 
      // if a user is decrypted
      return true;
    }
    return false;
  }

  logout(){
    localStorage.clear();
  }
}
