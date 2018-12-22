import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {NavController} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {ActivatedRoute, NavigationExtras, Params} from '@angular/router';
import {QueryParamsHandling} from '@angular/router/src/config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
    constructor(
        public navCtrl: NavController,
        private authService: AuthService,
        public tripService: EventService,
    ) {

    }


    ngOnInit() {

    }


    ShowEventDetail(eventId: string) {
        return this.navCtrl.navigateForward('EventDetail/' + eventId+'/');
    }

     logout() {
         this.authService.logoutUser().then(() => {
             this.navCtrl.navigateRoot('');
         }).catch(() => {
                 console.log('error in logout');
             }
         );

     }
}

