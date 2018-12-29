import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurfEvent} from '../models/surfEvent';

@Injectable({
  providedIn: 'root'
})
export class EventService {
    collection_endpoint = 'events';

    events: AngularFirestoreCollection<SurfEvent>;
    eventDoc: AngularFirestoreDocument<SurfEvent>;


    constructor(private afs: AngularFirestore) {
        this.events = this.afs.collection(this.collection_endpoint, ref => ref.orderBy('region', 'asc'));
    }

     getEvents(): Observable<SurfEvent[]> {
        return this.events.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfEvent;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
    }



     getEvent(id: string): Observable<SurfEvent> {
        this.eventDoc = this.events.doc<SurfEvent>(id);
        return this.eventDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as SurfEvent;
                data.id = action.payload.id;
                return data;
            }
        }));
    }




    async addEvent(event: SurfEvent) {
        return this.events.add({...event}).then(function(docRef) {
            console.log('Route document written with ID: ', docRef.id);
            return docRef.id;
        }).catch(function(error) {
            alert('Failed creating route ' + error);
            console.error('Error adding document: ', error);
        });
    }

    async updateEvent(id, update) {
        //Get the task document
        this.eventDoc = this.afs.doc<SurfEvent>(`${this.collection_endpoint}/${id}`);
        return this.eventDoc.update(update);
    }




}
