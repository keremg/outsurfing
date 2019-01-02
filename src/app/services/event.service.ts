import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurfEvent} from '../models/surfEvent';
import {SurfParticipant} from '../models/surfParticipant';
import {UserService} from './user.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EventService {
    collection_endpoint = 'events';
    participant_collection_endpoint = 'participants';
    events: AngularFirestoreCollection<SurfEvent>;
    eventDoc: AngularFirestoreDocument<SurfEvent>;


    constructor(private afs: AngularFirestore,
                private userService: UserService) {
        this.events = this.afs.collection(this.collection_endpoint, ref => ref.orderBy('region', 'asc'));
    }

     getEvents(): Observable<SurfEvent[]> {
        return this.events.snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfEvent;
                data.participant = this.getParticipants(action.payload.doc.id);
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
                data.participant = this.getParticipants(id);
                data.participant.subscribe(v=>console.log(v));
                return data;
            }
        }));
    }

    getParticipants(id: string): Observable<SurfParticipant[]> {
        return this.events.doc(id).collection(this.participant_collection_endpoint).snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfParticipant;
                data.id = action.payload.doc.id;
                data.user = this.userService.getuser(data.id);
                return data;
            });
        }));
    }




    async addEvent(event: SurfEvent) {
        delete event.participant;
        debugger;

        return this.events.add({...event}).then((docRef) => {
            console.log('Route document written with ID: ', docRef.id);
            return docRef.id;

        }).catch(function(error) {
            alert('Failed creating route ' + error);
            console.error('Error adding document: ', error);
        });
    }

    async joinEvent(id, participant){
        //TODO other logic - to updatefields like car and stuff?
        let uid = participant.id;
        this.events.doc(id).update({[uid]:1});
        delete participant.id;
        delete participant.user;
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).set({...participant}).catch(function(error) {
            alert('Failed adding participant' + error);
            console.error('Error adding participant: ', error);
        });
    }

    async leaveEvent(id, uid){
        //TODO other logic - to updatefields like car and stuff?
        this.events.doc(id).update({[uid]:firebase.firestore.FieldValue.delete()});
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).delete().catch(function(error) {
            alert('Failed deleting participant' + error);
            console.error('Error deleting participant: ', error);
        });
    }

    async approveParticipant(id, uid){
        this.events.doc(id).update({[uid]:1});
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).update({approved:true}).catch(function(error) {
            alert('Failed deleting participant' + error);
            console.error('Error deleting participant: ', error);
        });
    }

    async disapproveParticipant(id, uid){
        this.events.doc(id).update({[uid]:firebase.firestore.FieldValue.delete()});
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).update({approved:false}).catch(function(error) {
            alert('Failed deleting participant' + error);
            console.error('Error deleting participant: ', error);
        });
    }

    async updateEvent(id, update) {
        //Get the task document
        delete update.participant;
        this.eventDoc = this.afs.doc<SurfEvent>(`${this.collection_endpoint}/${id}`);
        return this.eventDoc.update(update);
    }

    async deleteEvent(id) {
        //Get the task document
        this.eventDoc = this.afs.doc<SurfEvent>(`${this.collection_endpoint}/${id}`);
// TODO should delete participants
        return this.eventDoc.delete();
    }


}
