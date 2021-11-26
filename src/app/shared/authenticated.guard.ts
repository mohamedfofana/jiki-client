import { LoggerService } from './../core/services/utils/logger.service';
import { StorageService } from './../core/services/local/storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private _storageService: StorageService,
    private _loggerService:LoggerService,
    private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._storageService.isLoggedIn()){
      return true;
    }
    this._router.navigate(['login']);
    return false;
  }

}
