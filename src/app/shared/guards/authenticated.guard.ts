import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/database/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard  {
  constructor(private _authService: AuthService,
              private _router: Router,
              private _route: ActivatedRoute) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authService.isUserAndTokenValid()){
      // TODO CHECK IF USER HAS ACCESS TO URL  
      // TODO map with subrole and urlsaccessible    
        return true;
    }
    this._router.navigate(['login']);
    return false;
  }

}
