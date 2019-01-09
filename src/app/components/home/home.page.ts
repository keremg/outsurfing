import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {NavController, PopoverController} from '@ionic/angular';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { SurfUser } from '../../models/surfUser';
import {ActivatedRoute, Router} from '@angular/router';
import {ReplaySubject,} from 'rxjs';
import { SurfEvent } from '../../models/surfEvent';
import leaflet from 'leaflet';
import {FilterEventsPage} from '../filter-events/filter-events.page';

declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PaginationService]
})
export class HomePage implements OnInit {
  currentUser: SurfUser;
  onlyMine: boolean = false;
  query: string;
  searched: boolean;
  location: ReplaySubject<string[]> = new ReplaySubject(1);
    filter: {};
    map:any;
  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    public page: PaginationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController
  ) {
      window.home = this;
  }

  async ngOnInit() {
    this.currentUser = await this.userService.getCurrentUserPromise();
      this.query = this.activatedRoute.snapshot.paramMap.get('q');
      this.filter = this.getFilter(this.activatedRoute.snapshot.paramMap.get('f'));
    if(this.query === '0'){
        this.query = null;
    }


    if (this.query == this.currentUser.id) {
      this.onlyMine = true;
      this.page.init(
        'events',
        this.currentUser.id,
        { reverse: true, prepend: false },
        this.currentUser.id
      );
    } else {
        this.page.init(
            'events',
            'name',
            {reverse: true, prepend: false},
            null,
            this.query,
            this.filter
        );
    }
      this.locate();
    const searchbar = document.getElementById('search');
  }

  getFilter(str:string) {
      if (str && str.length > 0) {
          let x = {};
          let split = str.split('&')
          for (let f in split) {
              let kv = split[f].split('.');
              x[kv[0]] = kv[1];
          }
          return x;
      }
  }

  getFilterText(){
      if(this.filter) {
          let str = '';
          for (let f in this.filter) {
                str+= f +'.' +this.filter[f]+'&';
          }
          return str;
      }
      return '';
  }

  search(ev) {
    let q = (ev as CustomEvent).detail.value;
    if(q !== this.query) {
        this.navCtrl.navigateRoot('home/' + q +'/'+this.getFilterText());
    }
  }

  hideElement(id: string, val: boolean) {
    let ele = document.getElementById(id);
    if (ele) {
      ele.hidden = val;
      //ele.parentNode.removeChild(ele);
    } else {
      console.log(id);
    }
  }



  ShowEventDetail(eventId: string) {
    return this.navCtrl.navigateForward('EventDetail/' + eventId + '/0');
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

  routeImageUrl(surfRoute: SurfEvent) {
    if (surfRoute.imagesUrls && surfRoute.imagesUrls.length > 0) {
      return surfRoute.imagesUrls[0];
    }
    return '';
  }

  userImageUrl(eventOrganizerId:any){
    console.log("in users images url",eventOrganizerId);
    if (eventOrganizerId){
      return 'users/'+eventOrganizerId+'/profilePicMedium';
    }
      return '';
  }

  userName(event:any){

     this.userService.getuser(event).subscribe(res=>{
      return res.firstName;
    });

  }

  getAge(birth){
    if(birth) {
        var ageDifMs = Date.now() - new Date(birth).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return ', Age: '+ Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }

    onCreateEvent(){
        return this.navCtrl.navigateRoot('ChooseRoute');

    }

    locate(){
        if(this.map){
            this.map.remove();
        }
        this.map = leaflet.map('map').fitWorld();
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

    onViewProfile(uid:string, e) {
        e.stopPropagation();
        this.navCtrl.navigateForward('ViewProfile/' + uid);

    }

    async onFilter(ev){

        const popover = await this.popoverController.create({
            component: FilterEventsPage,
            componentProps: {query: this.query,
            filter: this.filter,
            isRoute:false},
            event:ev});
        return await popover.present();
    }
}
