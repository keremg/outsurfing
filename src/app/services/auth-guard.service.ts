import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }
  canActivate() {
      if ( this.authService.isLoggedIn() ) {
          return true;
      }
      this.router.navigate(['/']);
      return false;
  }
}
