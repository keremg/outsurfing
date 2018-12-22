import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Route} from '../models/Route';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Event} from '../models/Event';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  collection_endpoint = 'routes';

    routes: AngularFirestoreCollection<Route>;
    private routeDoc: AngularFirestoreDocument<Route>;


  constructor(private db: AngularFirestore) {
      this.routes = db.collection<Route>(this.collection_endpoint);
  }

    addRoute(newRoute: any) {
        this.routes.add({...newRoute});
    }

    async updateRoute(id, update) {
        //Get the task document
        this.routeDoc = this.db.doc<Route>(`${this.collection_endpoint}/${id}`);
        return this.routeDoc.update(update);
    }

    getRoute(id) : Observable<Route>{
      this.routeDoc = this.db.doc<Route>(`${this.collection_endpoint}/${id}`);
      let route = this.routeDoc.snapshotChanges().pipe(map(action => {
            if (action.payload.exists === false) {
                return null;
            } else {
                const data = action.payload.data() as Route;
                data.id = action.payload.id;
                return data;
            }
        }));
        return route;
    }

    getRoutes(): Observable<Route[]>{
        return this.db
            .collection(this.collection_endpoint)
            .snapshotChanges()
            .pipe(map(actions => {
                return actions.map(a => {
                    //Get document data
                    const data = a.payload.doc.data() as Route;
                    //Get document id
                    data.id = a.payload.doc.id;
                    //Use spread operator to add the id to the document data
                    return data;
                });
            }));
    }
}
