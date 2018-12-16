import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Action } from 'rxjs/internal/scheduler/Action';
import {Route} from '../models/Route';


@Injectable({
  providedIn: 'root'
})
export class EventService {
    tripsCollection: AngularFirestoreCollection<Route>;
    tripDocRef: AngularFirestoreDocument<Route>;
    trips: Observable<Route[]>;
    trip: Observable<Route>;

    constructor(private afs: AngularFirestore) {
        this.tripsCollection = this.afs.collection('trips', ref => ref.orderBy('region', 'asc'));
    }

    getTrips(): Observable<Route[]> {
      debugger;
        this.trips = this.tripsCollection.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as Route;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
        return this.trips;
    }

    addTrip(trip: Route) {
        this.tripsCollection.add(trip);
    }


    gettrip(id: string): Observable<Route> {
        this.tripDocRef = this.afs.doc<Route>(`trips/${id}`);
        this.trip = this.tripDocRef.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as Route;
                data.id = action.payload.id;
                return data;
            }
        }));
        return this.trip;
    }

}
