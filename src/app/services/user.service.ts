import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurfUser} from '../models/surfUser';
import {AuthService} from './auth.service';
import {SurfRoute} from '../models/surfRoute';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    userDoc: AngularFirestoreDocument<SurfUser>;
    user: Observable<SurfUser>;
    currentUser: ReplaySubject<SurfUser> = new ReplaySubject(1);
    userId: string;
    collection_endpoint = 'users';

    constructor(private afs: AngularFirestore,
                private firebaseAuth: AngularFireAuth,
                private authService: AuthService) {
        this.authService.whenLoggedIn().asObservable().subscribe(() => {
            if (this.authService.authenticated) {
                this.getuser(this.authService.currentUserId).subscribe(u => {
                        if (u) {
                            this.currentUser.next(u);
                            this.currentUser.complete();
                        }
                        else {
                            this.currentUser.next(null);
                            this.currentUser.complete();
                        }
                    }
                );
            }
        });
    }

     getCurrentUser(): Observable<SurfUser> {
        return this.currentUser.asObservable();
    }

    async getCurrentUserPromise(): Promise<SurfUser> {
        return this.currentUser.toPromise();
    }

    async addUsers(userProfile: any) {
        await this.firebaseAuth.authState.subscribe(u => {
            if (u) {
                this.userId = u.uid;
            } else {
                // Empty the value when user signs out
                this.userId = null;
            }
        });
        this.afs.collection('users').doc(this.userId).set(userProfile);
    }


    async updateUSer(id, update) {
        //Get the task document
        this.userDoc = this.afs.doc<SurfUser>(`${this.collection_endpoint}/${id}`);
        return this.userDoc.update(update);
    }


    getuser(id: string): Observable<SurfUser> {
        this.userDoc = this.afs.collection('users').doc<SurfUser>(id);
        this.user = this.userDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as SurfUser;
                data.id = action.payload.id;
                return data;
            }

        }));
        return this.user;
    }

}
