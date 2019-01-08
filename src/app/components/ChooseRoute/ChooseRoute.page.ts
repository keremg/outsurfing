import { Component, OnInit } from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import { SurfRoute } from '../../models/surfRoute';
import { RouteService } from '../../services/route.service';
import { NavController } from '@ionic/angular';
import { PaginationService } from '../../services/pagination.service';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import leaflet from 'leaflet';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ChooseRoute',
  templateUrl: 'ChooseRoute.page.html',
  styleUrls: ['ChooseRoute.page.scss'],
  providers: [PaginationService]
})
export class ChooseRoute implements OnInit {
    location: ReplaySubject<string[]> = new ReplaySubject(1);
    query: string;
map:any;
    constructor(
    public routeService: RouteService,
    public navCtrl: NavController,
    public page: PaginationService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
      this.query = this.activatedRoute.snapshot.paramMap.get('q');


      if (this.query) {
          this.page.init(
              'routes',
              'name',
              {reverse: true, prepend: false},
              null,
              this.query
          );
      }
      else {
          this.page.init('routes', 'name', { reverse: true, prepend: false });
      }


    this.locate();
  }

  goToRoute(id) {
    this.navCtrl.navigateForward('SingleRoute/' + id);
  }

  createNew() {
    this.navCtrl.navigateForward('SingleRoute');
  }

  eventIt(routeId, e) {
      e.stopPropagation();
      this.navCtrl.navigateForward('EventDetail/0/' + routeId);
  }

  loadData(event) {
    this.page.more();

    //console.log('Done');
    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    //if (this.page.done) {
    //event.target.disabled = true;
    //}
  }

  routeImageUrl(surfRoute: SurfRoute) {
      if (surfRoute.imagesUrls && surfRoute.imagesUrls.length > 0) {
          return surfRoute.imagesUrls[0];
      }
      return '';
  }

    locate(){
        if(this.map){
            this.map.remove();
        }
        this.map=leaflet.map('map').fitWorld();
        this.map.locate({
            timeout: 30000,
            maximumAge: 300000
        }).on('locationfound', (e) => {
            this.location.next([e.latlng.lat, e.latlng.lng]);
            this.location.complete();
        }).on('locationerror', (err) => {
            console.log(err.message);
        });
        document.getElementById('map').hidden = true;

    }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    getDistance(geoLocation: string, loc: string[])
    {
        let lat1, lon1, lat2, lon2;
        let s = geoLocation.split(',');
        lat1=s[0];
        lon1=s[1];
        lat2=loc[0];
        lon2=loc[1];
        var R = 6371; // km
        var dLat = this.toRad(lat2-lat1);
        var dLon = this.toRad(lon2-lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return Math.round(d);
    }

    // Converts numeric degrees to radians
    toRad(Value)
    {
        return Value * Math.PI / 180;
    }


    onCreateRoute(){
        return this.navCtrl.navigateRoot('SingleRoute');

    }

    search(ev) {
        let q = (ev as CustomEvent).detail.value;
        this.navCtrl.navigateRoot('ChooseRoute/' + q);
    }

}
