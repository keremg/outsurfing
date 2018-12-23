import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Event} from '../models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
    collection_endpoint = 'events';

    events: AngularFirestoreCollection<Event>;
    eventDoc: AngularFirestoreDocument<Event>;


    constructor(private afs: AngularFirestore) {
        this.events = this.afs.collection(this.collection_endpoint, ref => ref.orderBy('region', 'asc'));
    }

     getEvents(): Observable<Event[]> {
        return this.events.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as Event;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
    }



     getEvent(id: string): Observable<Event> {
        this.eventDoc = this.events.doc<Event>(id);
        return this.eventDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as Event;
                data.id = action.payload.id;
                return data;
            }
        }));
    }




    async addEvent(event: Event) {
        return this.events.add({...event});
    }

    async updateEvent(id, update) {
        //Get the task document
        this.eventDoc = this.afs.doc<Event>(`${this.collection_endpoint}/${id}`);
        return this.eventDoc.update(update);
    }




}
