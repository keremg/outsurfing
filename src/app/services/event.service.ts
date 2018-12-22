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
    eventsCollection: AngularFirestoreCollection<Event>;
    eventDocRef: AngularFirestoreDocument<Event>;
    events: Observable<Event[]>;
    event: Observable<Event>;

    constructor(private afs: AngularFirestore) {
        this.eventsCollection = this.afs.collection('events', ref => ref.orderBy('region', 'asc'));
    }

     getEvents(): Observable<Event[]> {
      debugger;
        this.events = this.eventsCollection.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as Event;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
        return this.events;
    }


     getEvent(id: string): Observable<Event> {
        this.eventDocRef = this.eventsCollection.doc<Event>(id);
        this.event = this.eventDocRef.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as Event;
                data.id = action.payload.id;
                return data;
            }
        }));
        return this.event;
    }


    async addEvent(event: Event) {
        return this.eventsCollection.add(event);
    }

    async editEvent(event: Event){
        return this.eventsCollection.doc(event.id).update(event);
    }

}
