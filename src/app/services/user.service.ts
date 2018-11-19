import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/User';
import { Action } from 'rxjs/internal/scheduler/Action';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersCollection : AngularFirestoreCollection<User>;
  userDoc : AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;
  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection('users' , ref => ref.orderBy ('lastName' , 'asc'));
  }
  getUsers(): Observable<User[]> {
    this.users = this.usersCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(action => {
        const data = action.payload.doc.data() as User;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.users;
  }

  addUsers(user:any){
    this.usersCollection.add(user);
  }


  getuser(id:string): Observable<User>{
    this.userDoc = this.afs.doc<User>(`users/${id}`);
    this.user = this.userDoc.snapshotChanges().pipe(map(action=>{

        if(action.payload.exists === false){
          console.log('adi');
          return null;
         } else{
            const data = action.payload.data() as User;
            data.id = action.payload.id;
            return data;
         }

    }));
    return this.user;
  }

}
