import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Action } from 'rxjs/internal/scheduler/Action';
import {Trip} from '../models/Trip';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripsCollection : AngularFirestoreCollection<Trip>;
  tripDoc : AngularFirestoreDocument<Trip>;
  trips: Observable<Trip[]>;
  trip: Observable<Trip>;
  constructor(private afs: AngularFirestore) {
    this.tripsCollection = this.afs.collection('trips' , ref => ref.orderBy ('region' , 'asc'));
  }
  getTrips(): Observable<Trip[]> {
    this.trips = this.tripsCollection.snapshotChanges().pipe(map(changes=>{
      return changes.map(action => {
        const data = action.payload.doc.data() as Trip;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.trips;
  }

  addTrips(trip:any){
    this.tripsCollection.add(trip);
  }


  gettrip(id:string): Observable<Trip>{
    this.tripDoc = this.afs.doc<Trip>(`trips/${id}`);
    this.trip = this.tripDoc.snapshotChanges().pipe(map(action=>{

        if(action.payload.exists === false){
          console.log('adi');
          return null;
         } else{
            const data = action.payload.data() as Trip;
            data.id = action.payload.id;
            return data;
         }

    }));
    return this.trip;
  }

}
