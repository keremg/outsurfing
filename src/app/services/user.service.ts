import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SurfUser } from '../models/surfUser';
import { Action } from 'rxjs/internal/scheduler/Action';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDoc: AngularFirestoreDocument<SurfUser>;
  user: Observable<SurfUser>;

  userId: string;

  constructor(private afs: AngularFirestore,
    private firebaseAuth: AngularFireAuth) {

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


  getuser(id: string): Observable<SurfUser> {
    this.userDoc = this.afs.collection('users').doc<SurfUser>(id);
    this.user = this.userDoc.snapshotChanges().pipe(map(action => {

      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as SurfUser;
        return data;
      }

    }));
    return this.user;
  }

}
