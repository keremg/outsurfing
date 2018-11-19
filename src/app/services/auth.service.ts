import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';//import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    //this.user = firebaseAuth.authState;
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        firebase
          .database()
          .ref(`/userProfile/${newUserCredential.user.uid}/email`)
          .set(email);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  getCurrentUser(){
    return this.firebaseAuth.auth.currentUser;
  }

  resetPassword(email:string): Promise<void> {
    return this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = this.firebaseAuth.auth.currentUser.uid;
    /*firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();*/
    return this.firebaseAuth.auth.signOut();
  }
}
