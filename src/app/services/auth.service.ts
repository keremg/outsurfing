import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {first} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    authState: firebase.User = null;
    private logIns: Subject<boolean> = new ReplaySubject(1);


    constructor(private afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe((auth) => {
            this.authState = auth;
            if(auth) {
                this.logIns.next(true);
            } else {
                this.logIns.next(false);
            }

        });
    }

    public whenLoggedIn(): Subject<boolean> {
        return this.logIns;
    }

    // Returns true if user is logged in
    get authenticated() {
        //debugger;
        return this.authState !== null;
    }


    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState : null;
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState;
    }

    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : '';
    }





    async emailLogin(email: string, password: string) {
        return this.afAuth
            .auth
            .signInWithEmailAndPassword(email, password);
    }

    async emailSignup(email: string, password: string) {
        try {
            return this.afAuth
                .auth
                .createUserWithEmailAndPassword(email, password)
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async getCurrentUser() {
        return this.afAuth.auth.currentUser;
    }

    async deleteCurrentUser() {
        return this.afAuth.auth.currentUser.delete();
    }

    async resetPassword(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    async logoutUser() {
        return this.afAuth.auth.signOut();
    }


    //// Social Auth ////

    githubLogin() {
        const provider = new firebase.auth.GithubAuthProvider()
        return this.socialSignIn(provider);
    }

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider()
        return this.socialSignIn(provider);
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider()
        return this.socialSignIn(provider);
    }

    twitterLogin(){
        const provider = new firebase.auth.TwitterAuthProvider()
        return this.socialSignIn(provider);
    }

    private socialSignIn(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) =>  {
                this.authState = credential.user;
            })
            .catch(error => console.log(error));
    }







}
