import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
// You don't need to import firebase/app either since it's being imported above
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMZI_91y2rPlmYIoNnWJxOB0HrxysXHaQ",
  authDomain: "outsurfing-1aab4.firebaseapp.com",
  databaseURL: "https://outsurfing-1aab4.firebaseio.com",
  projectId: "outsurfing-1aab4",
  storageBucket: "outsurfing-1aab4.appspot.com",
  messagingSenderId: "1090451751620"
};


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
