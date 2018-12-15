import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {NavController} from '@ionic/angular';
import {map,first} from 'rxjs/operators';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private nav: NavController) { }

    public canActivate(): Observable<boolean> {
//Todo fix redirect
        return this.authService.whenLoggedIn().asObservable();
    }
}
