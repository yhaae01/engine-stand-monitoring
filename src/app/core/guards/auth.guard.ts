import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { LocalStorageServiceInterface } from '../interfaces/localstorage.service.interface';
import { LocalstorageService } from '../services/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivateChild {
  localservice: LocalStorageServiceInterface;

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
    this.localservice = new LocalstorageService();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.isAccessAllowed(childRoute, state);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    // console.log( this.keycloak.login());

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    const userProfile = await this.keycloak.loadUserProfile(true);
    localStorage.setItem('nopeg', userProfile.username);
    // this.userService
    //   .getData({GET_SOE_PERSONAL_INFO: {personalNumber: userProfile.username! }}, 'GET_SOE_PERSONAL_INFO')
    //   .valueChanges
    //   .subscribe((value) => {
    //     this.localservice.saveData('USER_INFO', JSON.stringify(value.data.personalInfo));
    //   });

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
