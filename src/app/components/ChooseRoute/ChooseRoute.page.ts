import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Route} from '../../models/Route';
import {RouteService} from '../../services/route.service';
import {NavController} from '@ionic/angular';
import {PaginationService} from '../../services/pagination.service';

@Component({
    selector: 'app-ChooseRoute',
    templateUrl: 'ChooseRoute.page.html',
    styleUrls: ['ChooseRoute.page.scss'],
    providers:[PaginationService],
})
export class ChooseRoute implements OnInit {

    constructor(public routeService: RouteService,
                public navCtrl: NavController,
                public page: PaginationService) {

    }

    ngOnInit() {
        //this.routesList = this.routeService.getRoutes();
        this.page.init('routes', 'name', {reverse: true, prepend: false});
    }

    goToRoute(id) {
        this.navCtrl.navigateForward('SingleRoute/' + id);
    }

    createNew() {
        this.navCtrl.navigateForward('SingleRoute');
    }

    eventIt(routeId) {
        this.navCtrl.navigateForward('EventDetail/0/' + routeId);
    }

    loadData(event) {
        this.page.more();

        console.log('Done');
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        //if (this.page.done) {
        //event.target.disabled = true;
        //}
    }
}
