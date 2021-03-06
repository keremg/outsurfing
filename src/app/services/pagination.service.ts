import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import {EventService} from './event.service';
import {UserService} from './user.service';
import {CommonService} from './common.service';

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
    _loading = new BehaviorSubject(false);
    private _data = new BehaviorSubject([]);

    private query: QueryConfig;
    rangeFieldName = '';

    // Observable data
    data: Observable<any>;
    done: Observable<boolean> = this._done.asObservable();
    loading: Observable<boolean> = this._loading.asObservable();


    constructor(private afs: AngularFirestore,
                private eventService: EventService,
                private userService: UserService,
                private commonService: CommonService) {
    }

    getQuery(ref: any) {
        let x: firebase.firestore.Query;
        if (this.query.uid) {
            x = ref.where(this.query.uid, '==', 1);
        } else {

            if (this.query.text && this.query.text.length >= 2) {
                // We limit the text-search to the first 20 characters, and minimum 2 letters
                x = ref.where('searchIndex', 'array-contains',
                    this.query.text.substring(0, this.commonService.MAX_TEXT_QUERY_LENGTH).toLowerCase());
            } else {
                x = ref;
            }
            if (this.query.path === 'events') {
                x = x.where('isPastEvent', '==', false);
            }
            //if empty country in filter, then no limit (show all countries). But if country is undefined then filter on current country
            if (this.userService.country && (!this.query.filter || this.query.filter.country === undefined)) {
                x = x.where('country', '==', this.userService.country);
            }
            if (this.userService.state && (!this.query.filter || !this.query.filter.state)) {
                x = x.where('state', '==', this.userService.state);
            }

            let alreadyUsedRangeFilter = false;
            if (this.query.filter) {
                for (let f in this.query.filter) {
                    if (f && f.length > 0) {
                        if (Array.isArray(this.query.filter[f])) {
                            if (alreadyUsedRangeFilter) {
                                console.log('Can\'t filter on a second range-filter for field ' + f); //Firebase limitation
                                continue;//skip this filter
                            }
                            // Range filter. May be only one filter!
                            if (this.query.filter[f].length === 2) {
                                if (this.query.filter[f][0]) {
                                    alreadyUsedRangeFilter = true;
                                    this.rangeFieldName = f;
                                    x = x.where(f, '>=', this.getIntOrString(this.query.filter[f][0]));
                                }
                                if (this.query.filter[f][1]) {
                                    alreadyUsedRangeFilter = true;
                                    this.rangeFieldName = f;
                                    x = x.where(f, '<=', this.getIntOrString(this.query.filter[f][1]));
                                }
                            } else {
                                console.log('Illegal filter field value for ' + f);
                            }
                        } else {
                            //Regular equals filter
                            if (this.query.filter[f]) {
                                x = x.where(f, '==', this.getIntOrString(this.query.filter[f]));
                            }
                        }

                    }
                }
            }
        }

        let sortDefaultFieldName;
        if (this.query.path === 'events') {
            sortDefaultFieldName = 'eventSortRanking';
        } else if(this.query.path === 'routes'){
            sortDefaultFieldName = 'routeSortRanking';//this.query.field;//'routeSortRanking';
        }

        if (this.query.field) {
            // Firebase limitation: When filtering on range-query (e.g. duration < 5 (hours)) then the sorting must also be on the same field
            let orderByField = (this.rangeFieldName) ? this.rangeFieldName : sortDefaultFieldName; //this.query.field;
            return x
                .orderBy(orderByField, this.query.reverse ? 'desc' : 'asc')
                //.orderBy('isPastEvent')
                .limit(this.query.limit);
        } else {
            //My Events or My Route requests
            return x
            //.orderBy('isPastEvent')
                .limit(this.query.limit);
        }

    }


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
        };
        this.rangeFieldName = '';

        const first = this.afs.collection(this.query.path, ref => {
            let x = this.getQuery(ref);
            return x;

        });

        this.mapAndUpdate(first);

        // Create the observable array for consumption in components
        return this.data = this._data.asObservable()
            .scan((acc, val) => {
                return this.query.prepend ? val.concat(acc) : acc.concat(val);
            });
    }

    getIntOrString(value) {
        if (parseInt(value)) {
            return parseInt(value);
        } else {
            return value;
        }
    }

    // Retrieves additional data from firestore
    more() {
        const cursor = this.getCursor();

        const more = this.afs.collection(this.query.path, ref => {
            let x = this.getQuery(ref);

            return x.startAfter(cursor);
        });
        return this.mapAndUpdate(more);
    }

    // Determines the doc snapshot to paginate query
    private getCursor() {
        const current = this._data.value;
        if (current.length) {
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
        }
        return null;
    }


    // Maps the snapshot to usable format the updates source
    private mapAndUpdate(col: AngularFirestoreCollection<any>) {

        if (this._done.value || this._loading.value) {
            return;
        }
        ;

        // loading
        this._loading.next(true);

        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .do(arr => {
                let values = arr.map(snap => {
                    const data = snap.payload.doc.data();
                    const doc = snap.payload.doc;
                    data.id = snap.payload.doc.id;
                    if (this.query.path === 'events') {
                        data.participantsObs = this.eventService.getParticipants(data.id);
                        data.participantsObs.subscribe(pars => {
                            data.participants = pars;
                        });
                        data.eventOrganizer = this.userService.getuser(data.eventOrganizerId);
                        data.routeCreator = this.userService.getuser(data.routeCreatorId);
                    }
                    if (this.query.path === 'routes') {
                        data.routeCreator = this.userService.getuser(data.routeCreatorId);
                    }
                    /*
                    if(!this.query.uid || (data.isPastEvent === false && (!this.query.filter || !this.query.filter['past'])))
                    {
                        data.shouldShow = true;
                    }
                    else if( data.isPastEvent === true && this.query.filter && this.query.filter['past']){
                        data.shouldShow = true;
                    }*/
                    data.shouldShow = true;
                    return {...data, doc};
                });

                // If prepending, reverse the batch order
                values = this.query.prepend ? values.reverse() : values;
                // update source with new values, done loading
                this._data.next(values);
                this._loading.next(false);

                // no more values, mark done
                if (!values.length) {
                    this._done.next(true);
                }
            })
            .take(1)
            .subscribe();

    }



}