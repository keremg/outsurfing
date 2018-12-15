import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {NavController} from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    constructor(
        public navCtrl: NavController,
        private authService: AuthService
    ) {

    }


    ngOnInit() {

    }

     logout() {
         this.authService.logoutUser().then(() => {
             this.navCtrl.navigateRoot('')
         }).catch(() => {
                 console.log("error in logout");
             }
         );

     }
}
