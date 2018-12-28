import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import {AngularFireModule} from 'angularFire2';
import {AngularFirestore , AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/storage';


import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AppRoutingModule ,
      AngularFireDatabaseModule, HttpClientModule, AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AuthGuardService,
      Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
