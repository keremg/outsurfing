import {Injectable} from '@angular/core';
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
                data.participantsObs = this.getParticipants(action.payload.doc.id);
                data.participantsObs.subscribe(pars => {
                    data.participants = pars;
                });
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
                data.participantsObs = this.getParticipants(id);
                data.participantsObs.subscribe(pars => {
                    data.participants = pars;
                });
                data.eventOrganizer = this.userService.getuser(data.eventOrganizerId);
                return data;
            }
        }));
    }

    async addEvent(event: SurfEvent) {
        delete event.participantsObs;
        delete event.participants;
        let x = this.getAllSubstrings(event.name);
        event.searchIndex = x;
        return this.events.add({...event}).then((docRef) => {
            return docRef.id;

        }).catch(function (error) {
            alert('Failed creating route ' + error);
            console.error('Error adding document: ', error);
        });
    }


    async updateEvent(id, update) {
        //Get the task document
        delete update.participantsObs;
        delete update.participants;
        if (update.name) {
            let x = this.getAllSubstrings(update.name);
            update.searchIndex = x;
        }
        this.eventDoc = this.afs.doc<SurfEvent>(`${this.collection_endpoint}/${id}`);
        return this.eventDoc.update(update);
    }

    async deleteEvent(id) {
        //Get the task document
        this.eventDoc = this.afs.doc<SurfEvent>(`${this.collection_endpoint}/${id}`);
// TODO should delete participants
        return this.eventDoc.delete();
    }


    getAllSubstrings(str) {
        var i, j, result = [];

        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push(str.slice(i, j));
            }
        }
        return result;
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

    async joinEvent(id, participant, event) {
        let uid = participant.id;
        this.events.doc(id).update({[uid]: 1});
        delete participant.id;
        delete participant.user;
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).set({...participant}).catch(function (error) {
            alert('Failed adding participantsObs' + error);
            console.error('Error adding participantsObs: ', error);
        });
    }

    async leaveEvent(id, uid, event) {
        let p: any;
        let newAvialableSeats = event.availableSeats;
        for (p in event.participants) {
            if (p.id === uid) {
                if (p.approved) {
                    newAvialableSeats -= p.offeringSeatsInCar;
                }
            }
        }
        this.events.doc(id).update({[uid]: firebase.firestore.FieldValue.delete(), availableSeats: newAvialableSeats});
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(uid).delete().catch(function (error) {
            alert('Failed deleting participantsObs' + error);
            console.error('Error deleting participantsObs: ', error);
        });
    }

    async approveParticipant(id, participant: SurfParticipant, event) {
        //if a user is approved - his place in car is saved.
        let newAvialableSeats = event.availableSeats || 0;
        if(!participant.needSeatInCar) {
            newAvialableSeats += participant.offeringSeatsInCar;
        }
        else{
            newAvialableSeats-=1;
        }

        let newApproved: number = event.approvedParticipants + 1;
        this.events.doc(id).update({
            [participant.id]: 1,
            approvedParticipants: newApproved,
            availableSeats: newAvialableSeats
        });
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(participant.id).update({approved: true}).catch(function (error) {
            alert('Failed deleting participantsObs' + error);
            console.error('Error deleting participantsObs: ', error);
        });
    }

    async disapproveParticipant(id, participant: SurfParticipant, event) {
        let newAvialableSeats = event.availableSeats || 0;
        if (participant.approved) {
            if(!participant.needSeatInCar) {
                newAvialableSeats -= participant.offeringSeatsInCar;
            }
            else{
                newAvialableSeats+=1;
            }
        }

        let newApproved: number = event.approvedParticipants - 1;
        this.events.doc(id).update({
            [participant.id]: firebase.firestore.FieldValue.delete(),
            approvedParticipants: newApproved,
            availableSeats: newAvialableSeats
        });
        return this.events.doc(id).collection(this.participant_collection_endpoint).doc(participant.id).update({approved: false}).catch(function (error) {
            alert('Failed deleting participantsObs' + error);
            console.error('Error deleting participantsObs: ', error);
        });
    }

}
