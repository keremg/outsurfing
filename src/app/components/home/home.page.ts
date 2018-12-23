import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs';
import {Event} from '../../models/Event';
import {PaginationService} from '../../services/pagination.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers:[PaginationService],
})

export class HomePage implements OnInit {


    constructor(
        public navCtrl: NavController,
        private authService: AuthService,
        //public eventService: EventService,
        public page: PaginationService
    ) {

    }


    ngOnInit() {
        this.page.init('events', 'key', {reverse: true, prepend: false});
    }


    ShowEventDetail(eventId: string) {
        return this.navCtrl.navigateForward('EventDetail/' + eventId + '/');
    }

    logout() {
        this.authService.logoutUser().then(() => {
            this.navCtrl.navigateRoot('');
        }).catch(() => {
                console.log('error in logout');
            }
        );

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

