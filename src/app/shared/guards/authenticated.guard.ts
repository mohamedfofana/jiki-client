import { LoggerService } from '../../core/services/utils/logger.service';
import { StorageService } from '../../core/services/local/storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/database/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router,
              private _route: ActivatedRoute) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

   
    if (this._authService.isLoggedIn()){
      // TODO CHECK IF USER HAS ACCESS TO URL
      const loginRoute: string = 'login';
      const url: string = route.url[0].toString();
      console.log('AuthenticatedGuard -> canActivate -> ' + url);
      if(url === loginRoute){
        this._router.navigate(['board']);
      }
      return true;
    }
    this._router.navigate(['login']);
    return false;
  }

}
