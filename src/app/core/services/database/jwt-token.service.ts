import { Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { StorageService } from '../local/storage.service';
import { IUser } from 'src/app/shared/model/user.model';

@Injectable({
  providedIn: 'root'
})

export class JwtTokenService {
  private token: string;
  decodedToken: JwtPayload;

  constructor( private _storageService: StorageService){}

  initToken(token: string){
    this.token = token;
    this.decode(token);
  }

  getToken(): string{
    return this.token;
  }

  getDecodedToken(): JwtPayload{
    return this.decodedToken;
  }

  decode(token: string){
    this.decodedToken = jwtDecode<JwtPayload>(token);
  }

  getExpiryDate(): number {
    return (this.decodedToken.exp) ? this.decodedToken.exp : 0;
  }

  getSub(): string {
    return (this.decodedToken.sub) ? this.decodedToken.sub : '';
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryDate();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    }
    return false;
  }

  isUserCertified(): boolean{
    const sub: string = this.getSub();
    const user = this._storageService.getUser();
    const dbSub = this.createUserSub(user);
    if (sub === dbSub) {
      return true;
    }
    return false;

  }

  private createUserSub(user: IUser): string{
    return user.username +'-' + user.email;
  }

}
