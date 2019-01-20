import {Component, OnInit} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {SurfRoute} from '../../models/surfRoute';
import {RouteService} from '../../services/route.service';
import {NavController, PopoverController} from '@ionic/angular';
import {PaginationService} from '../../services/pagination.service';
import {
    AngularFireStorage,
    AngularFireUploadTask
} from '@angular/fire/storage';
import leaflet from 'leaflet';
import {ActivatedRoute} from '@angular/router';
import {FilterEventsPage} from '../filter-events/filter-events.page';
import {DifficultiesEnum} from '../../enums/Difficulties.enum';
import {SurfUser} from '../../models/surfUser';
import {UserService} from '../../services/user.service';
import '../../../geocoder/Control.Geocoder';

declare let window: any;

@Component({
    selector: 'app-ChooseRoute',
    templateUrl: 'ChooseRoute.page.html',
    styleUrls: ['ChooseRoute.page.scss'],
    providers: [PaginationService]
})
export class ChooseRoute implements OnInit {
    currentUser: SurfUser;
    location: ReplaySubject<string[]> = new ReplaySubject(1);
    query: string;
    map: any;
    filter: {};
    onInitHappenedLast: boolean = false;
    difficultiesEnum = DifficultiesEnum;
    //country = ''; // better refer to this.userService.country
    //state = '';

    constructor(
        public routeService: RouteService,
        public navCtrl: NavController,
        public page: PaginationService,
        private activatedRoute: ActivatedRoute,
        private storage: AngularFireStorage,
        public popoverController: PopoverController,
        private userService: UserService,
    ) {
        window.chooseRoute = this;
    }

    async ngOnInit() {
        this.onInitHappenedLast = true;
        this.currentUser = await this.userService.getCurrentUserPromise();
        this.query = this.activatedRoute.snapshot.paramMap.get('q');
        this.filter = this.getFilter(this.activatedRoute.snapshot.paramMap.get('f'));
        if (this.query === '0') {
            this.query = null;
        }


        this.page.init(
            'routes',
            'name',
            {reverse: true, prepend: false},
            null,
            this.query,
            this.filter
        );

        this.page.data.subscribe(routes => {
            for (let i in routes) {
                let route = routes[i];

                route.distance = this.getDistance(route.routeStartGeolocation, this.userService.locationGeo);
                //this.location.subscribe(loc => {
                // this.userService.location.subscribe(loc => {
                //     debugger;
                //     route.distance = this.getDistance(route.routeStartGeolocation, loc);
                // });
            }
        });

        //this.locate();
    }

    ionViewDidEnter() {
        if (!this.onInitHappenedLast) {
            window.location.reload(true);
        }
        this.onInitHappenedLast = false;
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

//     locate() { //moved to userService
//         debugger;
//         if (this.map) {
//             this.map.remove();
//         }
//         let node = document.getElementById('map');
//         if (node) {
//             node.hidden = false;
//             let parent = node.parentNode;
//             node.parentNode.removeChild(node);
//             let div = document.createElement('div');
//             div.setAttribute('id', 'map');
// // as an example add it to the body
//             parent.appendChild(div);
//         }
//         const geocoder = leaflet.Control.Geocoder.nominatim();
//         this.map = leaflet.map('map').fitWorld();
//         this.map.locate({
//             timeout: 30000,
//             maximumAge: 300000
//         }).on('locationfound', (e) => {
//             debugger;
//             this.location.next([e.latlng.lat, e.latlng.lng]);
//             this.location.complete();
//             geocoder.reverse(e.latlng, this.map.options.crs.scale(this.map.getZoom()), (results) => {
//                 const r = results[0];
//                 if (r) {
//                     this.country = r.properties.address.country;
//                     this.state = r.properties.address.state;
//                     debugger;
//                 }
//             });
//
//
//             //maybe here set state/country? ???????????????????
//         }).on('locationerror', (err) => {
//             console.log(err.message);
//         });
//         document.getElementById('map').hidden = true;
//
//     }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    getDistance(geoLocation: string, loc: string[]) {
        let lat1, lon1, lat2, lon2;
        let s = geoLocation.split(',');
        lat1 = s[0];
        lon1 = s[1];
        lat2 = loc[0];
        lon2 = loc[1];
        let R = 6371; // km
        let dLat = this.toRad(lat2 - lat1);
        let dLon = this.toRad(lon2 - lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return Math.round(d);
    }

    // Converts numeric degrees to radians
    toRad(Value) {
        return Value * Math.PI / 180;
    }


    onCreateRoute() {
        return this.navCtrl.navigateRoot('SingleRoute');

    }


    getFilter(str: string) {
        if (str && str.length > 0) {
            if (str.startsWith('f_')) {
                if (str[str.length - 1] === '?') {
                    str = str.slice(2, -1); //remove first two chars and last one
                } else {
                    str = str.slice(2); //remove first two chars
                }
            }
            let x = decodeURIComponent(str);
            x = JSON.parse(x);
            return x;
        }
    }

    getFilterText() {
        if (this.filter) {
            let queryStr = JSON.stringify(this.filter);
            queryStr = encodeURIComponent(queryStr);
            return 'f_' + queryStr + '?';
        } else {
            return '';
        }
        //
        // if (this.filter) {
        //     let str = '';
        //     for (let f in this.filter) {
        //         str += f + '.' + this.filter[f] + '&';
        //     }
        //     return str;
        // }
        // return '';
    }

    search(ev) {
        let q = (ev as CustomEvent).detail.value;
        if (q !== this.query) {
            this.navCtrl.navigateRoot('ChooseRoute/' + q + '/' + this.getFilterText());
        }
    }

    async onFilter(ev) {

        const popover = await this.popoverController.create({
            component: FilterEventsPage,
            componentProps: {
                query: this.query,
                filter: this.filter,
                isRoute: true,
                currentUser: this.currentUser
            },
            event: ev
        });
        return await popover.present();
    }

    onViewProfile(uid: string, e) {
        e.stopPropagation();
        this.navCtrl.navigateForward('ViewProfile/' + uid);

    }

    getDurationText(durationInHours) {
        let units = 'hours';
        let res = durationInHours;
        if (durationInHours > 24) {
            units = 'days';
            res = Math.floor(durationInHours / 24);
        }
        return res + ' ' + units;
    }

}
