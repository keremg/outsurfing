import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';//import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: AngularFireAuth) {  }

  async loginUser(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }

  async signupUser(email: string, password: string) {
    try {
      return this.firebaseAuth
        .auth
        .createUserWithEmailAndPassword(email, password)
    }
    catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getCurrentUser() {
    return this.firebaseAuth.auth.currentUser;
  }

  async deleteCurrentUser(){
    return this.firebaseAuth.auth.currentUser.delete();
  }

  async resetPassword(email: string) {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  async logoutUser() {
    return this.firebaseAuth.auth.signOut();
  }
}
