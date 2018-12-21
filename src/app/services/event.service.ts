import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Action } from 'rxjs/internal/scheduler/Action';
import {Event} from '../models/Event';


@Injectable({
  providedIn: 'root'
})
export class EventService {
    tripsCollection: AngularFirestoreCollection<Event>;
    tripDocRef: AngularFirestoreDocument<Event>;
    trips: Observable<Event[]>;
    trip: Observable<Event>;

    constructor(private afs: AngularFirestore) {
        this.tripsCollection = this.afs.collection('trips', ref => ref.orderBy('region', 'asc'));
    }

    getTrips(): Observable<Event[]> {
      debugger;
        this.trips = this.tripsCollection.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as Event;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
        return this.trips;
    }

    addTrip(trip: Event) {
        this.tripsCollection.add(trip);
    }


    gettrip(id: string): Observable<Event> {
        this.tripDocRef = this.afs.doc<Event>(`trips/${id}`);
        this.trip = this.tripDocRef.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as Event;
                data.id = action.payload.id;
                return data;
            }
        }));
        return this.trip;
    }

}
