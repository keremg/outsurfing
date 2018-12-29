import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {SurfRoute} from '../models/surfRoute';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurfEvent} from '../models/surfEvent';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  collection_endpoint = 'routes';

    routes: AngularFirestoreCollection<SurfRoute>;
    private routeDoc: AngularFirestoreDocument<SurfRoute>;


  constructor(private db: AngularFirestore) {
      this.routes = db.collection<SurfRoute>(this.collection_endpoint);
  }

    addRoute(newRoute: any): Promise<string|void> {
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
}
