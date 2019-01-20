import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {SurfRoute} from '../models/surfRoute';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from './user.service';
import {SurfReview} from '../models/surfReview';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  collection_endpoint = 'routes';
    review_collection_endpoint = 'reviews';

    routes: AngularFirestoreCollection<SurfRoute>;
    private routeDoc: AngularFirestoreDocument<SurfRoute>;


  constructor(private db: AngularFirestore,
              private userService: UserService,
              private commonService: CommonService) {
      this.routes = db.collection<SurfRoute>(this.collection_endpoint);
  }

    addRoute(newRoute: any): Promise<string|void> {
        delete newRoute.routeCreator;
        let x = this.commonService.getAllSubstrings(newRoute.name);
        newRoute.searchIndex = x;
        return this.routes.add({...newRoute}).then(function(docRef) {
            console.log('Route document written with ID: ', docRef.id);
            return docRef.id;
        }).catch(function(error) {
            alert('Failed creating route ' + error);
            console.error('Error adding document: ', error);
        });
    }

    async updateRoute(id, update) {
        //Get the task document
        delete update.routeCreator;

        if(update.name) {
            let x = this.commonService.getAllSubstrings(update.name);
            update.searchIndex = x;
        }
        update.routeSortRanking = this.commonService.calculateRouteSort(update);

        this.routeDoc = this.db.doc<SurfRoute>(`${this.collection_endpoint}/${id}`);
        return this.routeDoc.update(({...update}));
    }

    getRoute(id) : Observable<SurfRoute>{
      this.routeDoc = this.db.doc<SurfRoute>(`${this.collection_endpoint}/${id}`);
      let route = this.routeDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as SurfRoute;
                data.id = action.payload.id;
                data.routeCreator = this.userService.getuser(data.routeCreatorId);
                return data;
            }
        }));
        return route;
    }

    getRoutes(): Observable<SurfRoute[]>{
        return this.db
            .collection(this.collection_endpoint)
            .snapshotChanges()
            .pipe(map(actions => {
                return actions.map(a => {
                    //Get document data
                    const data = a.payload.doc.data() as SurfRoute;
                    //Get document id
                    data.id = a.payload.doc.id;
                    //Use spread operator to add the id to the document data
                    return data;
                });
            }));
    }

    async deleteRoute(id) {
        //Get the task document
        this.routeDoc = this.db.doc<SurfRoute>(`${this.collection_endpoint}/${id}`)
        return this.routeDoc.delete();
    }

    async addReview(route:SurfRoute, rev: SurfReview){
        if(!route.routeRanking){
            route.routeRanking = 0;
        }
        if(!route.routeNumOfRankers){
            route.routeNumOfRankers = 0;
        }
        delete rev.id;

        this.db.doc<SurfRoute>(`${this.collection_endpoint}/${route.id}`).collection(this.review_collection_endpoint).add({...rev}).catch(function (error) {
            alert('Failed adding review' + error);
            console.error('Error adding review: ', error);
        });

      let grade = ((route.routeRanking * route.routeNumOfRankers) + rev.grade)/(route.routeNumOfRankers+1);
      route.routeRanking = grade;
      route.routeNumOfRankers++;
      let sortRank = this.commonService.calculateRouteSort(route);
      return this.updateRoute(route.id,{routeRanking: route.routeRanking, routeNumOfRankers: route.routeNumOfRankers, routeSortRanking: sortRank});
    }

    getRouteReviews(id: string): Observable<SurfReview[]> {
        return this.db.doc<SurfRoute>(`${this.collection_endpoint}/${id}`).collection(this.review_collection_endpoint).snapshotChanges().pipe(map(changes => {
            return changes.map(action => {
                const data = action.payload.doc.data() as SurfReview;
                data.id = action.payload.doc.id;
                return data;
            });
        }));
    }

    ReviewAlreadyExist(routeId, uid, fromEventId) : Observable<boolean>{
        return this.db.doc<SurfRoute>(`${this.collection_endpoint}/${routeId}`).collection(this.review_collection_endpoint, ref => {
            return ref.where('reviewerId', '==', uid)
                .where('forEventId', '==', fromEventId);
        }).snapshotChanges().pipe(map((action:any) => {
            if(action && action.length >0 && action[0].payload.doc.exists  )
                return true;
            else return false;
        }));
    }

}
