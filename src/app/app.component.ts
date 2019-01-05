import {Component, OnInit} from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
// You don't need to import firebase/app either since it's being imported above
import 'firebase/auth';
import {UserService} from './services/user.service';
import {SurfUser} from './models/surfUser';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    currentUser: SurfUser;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserService,
        private navCtrl: NavController,
        private menuCtrl: MenuController
    ) {
        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    async ngOnInit() {
        this.currentUser = await this.userService.getCurrentUserPromise();
    }

    onMytrips() {
        this.menuCtrl.close();
        return this.navCtrl.navigateRoot('home/' + this.currentUser.id);
    }

    OnShowAll(){
        this.menuCtrl.close();
        return this.navCtrl.navigateRoot('home');

    }

    onCreateEvent(){
        this.menuCtrl.close();
        return this.navCtrl.navigateRoot('ChooseRoute');

    }

    onAddRoute(){
        this.menuCtrl.close();
        return this.navCtrl.navigateRoot('SingleRoute');

    }

}
