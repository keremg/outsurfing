import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';
import {PaginationService} from '../../services/pagination.service';
import {UserService} from '../../services/user.service';

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
        public page: PaginationService,
        private userService: UserService
    ) {

    }


    async ngOnInit() {
        this.page.init('events', 'name', {reverse: true, prepend: false});
        await this.userService.getCurrentUser().subscribe(value => {
            console.log(value);
        });
        let x = await this.userService.getCurrentUserPromise();
        console.log(x);
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

