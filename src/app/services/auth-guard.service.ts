import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {NavController} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private nav: NavController) { }

  canActivate() {
      return true;
      debugger;
      if ( this.authService.authenticated ) {
          return true;
      }
      this.nav.navigateRoot('');
      return false;
  }
}
