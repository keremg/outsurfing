import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import {EventService} from './event.service';
import {UserService} from './user.service';

interface QueryConfig {
    path: string, //  path to collection
    field: string, // field to orderBy
    uid: string,
    text: string,
    filter: any,
    limit: number, // limit per query
    reverse: boolean, // reverse order?
    prepend: boolean // prepend to source?
}

@Injectable()
export class PaginationService {

    // Source data
    private _done = new BehaviorSubject(false);
    private _loading = new BehaviorSubject(false);
    private _data = new BehaviorSubject([]);

    private query: QueryConfig;

    // Observable data
    data: Observable<any>;
    done: Observable<boolean> = this._done.asObservable();
    loading: Observable<boolean> = this._loading.asObservable();


    constructor(private afs: AngularFirestore,
                private eventService: EventService,
                private userService: UserService) { }

    // Initial query sets options and defines the Observable
    // passing opts will override the defaults
    init(path: string, field: string, opts?: any, uid?: string, text?: string, filter?: any) {
        this.query = {
            path,
            field,
            uid,
            text,
            filter,
            limit: 2,
            reverse: false,
            prepend: false,
            ...opts
        }

        const first = this.afs.collection(this.query.path, ref => {
            let x : firebase.firestore.Query;
            if(this.query.uid){
                x = ref.where(this.query.uid,'>', 0);
            }
            else {

                if (this.query.text) {
                    x = ref.where("searchIndex", 'array-contains', this.query.text);
                } else {
                    x = ref;
                }

                if(this.query.filter){
                    for(let f in this.query.filter){
                        if(f && f.length>0) {
                            x = x.orderBy(f);
                            x = x.where(f, '>', parseInt(this.query.filter[f]));
                        }
                    }
                }
                x = x.where('isPastEvent', '==', false)
            }
            return x
                .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                //.orderBy('isPastEvent')
                .limit(this.query.limit)

        })

        this.mapAndUpdate(first)

        // Create the observable array for consumption in components
        return this.data = this._data.asObservable()
            .scan( (acc, val) => {
                return this.query.prepend ? val.concat(acc) : acc.concat(val)
            })
    }


    // Retrieves additional data from firestore
    more() {
        const cursor = this.getCursor()

        const more = this.afs.collection(this.query.path, ref => {
            let x : firebase.firestore.Query;
            if(this.query.uid){
                x = ref.where(this.query.uid,'>', 0);
            }
            else {

                if (this.query.text) {
                    x = ref.where("searchIndex", 'array-contains', this.query.text);
                } else {
                    x = ref;
                }

                if(this.query.filter){
                    for(let f in this.query.filter){
                        if(f && f.length>0) {
                            x = x.orderBy(f);
                            x = x.where(f, '>', parseInt(this.query.filter[f]));
                        }
                    }
                }
                x = x.where('isPastEvent', '==', false)

            }

            return x
                .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
                //.orderBy('isPastEvent')
                .limit(this.query.limit)
                .startAfter(cursor)
        })
        return this.mapAndUpdate(more)
    }

    // Determines the doc snapshot to paginate query
    private getCursor() {
        const current = this._data.value
        if (current.length) {
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc
        }
        return null
    }


    // Maps the snapshot to usable format the updates source
    private mapAndUpdate(col: AngularFirestoreCollection<any>) {

        if (this._done.value || this._loading.value) { return };

        // loading
        this._loading.next(true)

        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .do(arr => {
                let values = arr.map(snap => {
                    const data = snap.payload.doc.data()
                    const doc = snap.payload.doc
                    data.id = snap.payload.doc.id;
                    if(this.query.path === 'events'){
                        data.participantsObs = this.eventService.getParticipants(data.id);
                        data.participantsObs.subscribe(pars=>{
                            data.participants = pars;
                        })
                        data.eventOrganizer = this.userService.getuser(data.eventOrganizerId);
                        data.routeCreator = this.userService.getuser(data.routeCreatorId);
                    }
                    if(this.query.path === 'routes'){
                        data.routeCreator = this.userService.getuser(data.routeCreatorId);
                    }
                    return { ...data, doc }
                })

                // If prepending, reverse the batch order
                values = this.query.prepend ? values.reverse() : values
                // update source with new values, done loading
                this._data.next(values)
                this._loading.next(false)

                // no more values, mark done
                if (!values.length) {
                    this._done.next(true)
                }
            })
            .take(1)
            .subscribe()

    }

}