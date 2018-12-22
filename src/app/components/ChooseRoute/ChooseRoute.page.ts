import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Route} from '../../models/Route';
import {RouteService} from '../../services/route.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-ChooseRoute',
  templateUrl: 'ChooseRoute.page.html',
  styleUrls: ['ChooseRoute.page.scss'],
})
export class ChooseRoute implements OnInit {
    public routesList: Observable<Route[]>;

    constructor(public routeService: RouteService,
                public navCtrl: NavController){

    }

    ngOnInit() {
        this.routesList = this.routeService.getRoutes();
    }

    goToRoute(id){
        this.navCtrl.navigateForward('SingleRoute/'+id)
    }

    createNew(){
        this.navCtrl.navigateForward('SingleRoute')
    }

    eventIt(routeId){
        this.navCtrl.navigateForward('EventDetail/0/'+routeId)
    }
}
