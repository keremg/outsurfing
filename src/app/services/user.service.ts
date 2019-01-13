import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurfUser} from '../models/surfUser';
import {AuthService} from './auth.service';
import {SurfRoute} from '../models/surfRoute';
import {SurfEvent} from '../models/surfEvent';
import {SurfReview} from '../models/surfReview';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    userDoc: AngularFirestoreDocument<SurfUser>;
    user: Observable<SurfUser>;
    currentUser: ReplaySubject<SurfUser> = new ReplaySubject(1);
    userId: string;
    collection_endpoint = 'users';
    review_collection_endpoint = 'reviews';
    guide_review_collection_endpoint = 'guideReviews';


    constructor(private afs: AngularFirestore,
                private firebaseAuth: AngularFireAuth,
                private authService: AuthService) {
        this.authService.whenLoggedIn().asObservable().subscribe(() => {
            if (this.authService.authenticated) {
                this.getuser(this.authService.currentUserId).subscribe(u => {
                        if (u) {
                            this.currentUser.next(u);
                            this.currentUser.complete();
                        }
                        else {
                            this.currentUser.next(null);
                            this.currentUser.complete();
                        }
                    }
                );
            }
        });
    }

     getCurrentUser(): Observable<SurfUser> {
        return this.currentUser.asObservable();
    }

    async getCurrentUserPromise(): Promise<SurfUser> {
        return this.currentUser.toPromise();
    }

    async addUsers(userProfile: any) {
        let u = await new Promise<any>(res=> this.firebaseAuth.authState.subscribe(res));
        if (u) {
            this.userId = u.uid;
        } else {
            // Empty the value when user signs out
            this.userId = null;
        }
        await this.afs.collection('users').doc(this.userId).set(userProfile);
    }


    async updateUser(id, update) {
        //Get the task document
        this.userDoc = this.afs.doc<SurfUser>(`${this.collection_endpoint}/${id}`);
        console.log(this.userDoc);
        return this.userDoc.update(({...update}));
    }


    getuser(id: string): Observable<SurfUser> {
        this.userDoc = this.afs.collection('users').doc<SurfUser>(id);
        this.user = this.userDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as SurfUser;
                data.id = action.payload.id;
                return data;
            }

        }));
        return this.user;
    }

    async addReview(user:SurfUser, rev: SurfReview){
        if(!user.avgRating){
            user.avgRating = 0;
        }
        if(!user.numOfRaters){
            user.numOfRaters = 0;
        }
        delete rev.id;


        this.afs.doc<SurfUser>(`${this.collection_endpoint}/${user.id}`).collection(this.review_collection_endpoint).add({...rev}).catch(function (error) {
            alert('Failed adding review' + error);
            console.error('Error adding review: ', error);
        });

        let grade = ((user.avgRating * user.numOfRaters) + rev.grade)/(user.numOfRaters+1)
        return this.updateUser(user.id,{avgRating: grade, numOfRaters: user.numOfRaters+1})
    }

    getUserReviews(id: string): Observable<SurfReview[]> {
        return this.afs.doc<SurfUser>(`${this.collection_endpoint}/${id}`).collection(this.review_collection_endpoint).snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfReview;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
    }

    ReviewAlreadyExist(uid, fromUid, fromEventId) : Observable<boolean>{
        return this.afs.doc<SurfUser>(`${this.collection_endpoint}/${uid}`).collection(this.review_collection_endpoint, ref => {
            return ref.where('reviewerId', '==', fromUid)
                .where('forEventId', '==', fromEventId);
        }).snapshotChanges().pipe(map((action:any) => {
            if(action && action.length >0 && action[0].payload.doc.exists) {
                return true;
            } else {
                return false;
            }
        }));
    }

    async addGuideReview(user:SurfUser, rev: SurfReview){
        if(!user.avgRating){
            user.avgRating = 0;
        }
        if(!user.numOfRaters){
            user.numOfRaters = 0;
        }
        delete rev.id;


        this.afs.doc<SurfUser>(`${this.collection_endpoint}/${user.id}`).collection(this.guide_review_collection_endpoint).add({...rev}).catch(function (error) {
            alert('Failed adding review' + error);
            console.error('Error adding review: ', error);
        });

        let grade = ((user.avgGuideRating * user.numOfGuideRaters) + rev.grade)/(user.numOfGuideRaters+1)
        return this.updateUser(user.id,{avgGuideRating: grade, numOfGuideRaters: user.numOfGuideRaters+1})
    }

    getGuideReviews(id: string): Observable<SurfReview[]> {
        return this.afs.doc<SurfUser>(`${this.collection_endpoint}/${id}`).collection(this.guide_review_collection_endpoint).snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfReview;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
    }

    GuideReviewAlreadyExist(uid, fromUid, fromEventId) : Observable<boolean>{
        return this.afs.doc<SurfUser>(`${this.collection_endpoint}/${uid}`).collection(this.guide_review_collection_endpoint, ref => {
            return ref.where('reviewerId', '==', fromUid)
                .where('forEventId', '==', fromEventId);
        }).snapshotChanges().pipe(map((action:any) => {
            if(action && action.length >0 && action[0].payload.doc.exists) {
                return true;
            } else {
                return false;
            }
        }));
    }

    getAge(birthDay) {
        if(birthDay) {
            let ageDifMs = Date.now() - new Date(birthDay).getTime();
            let ageDate = new Date(ageDifMs); // miliseconds from epoch
            return '' + Math.abs(ageDate.getUTCFullYear() - 1970);
        }
    }

}
