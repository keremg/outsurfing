import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SurfRoute } from '../../models/surfRoute';
import * as _ from 'lodash';
import { SurfUser } from '../../models/surfUser';
import { ActivatedRoute } from '@angular/router';
//import { ImagePicker } from '@ionic-native/image-picker';
import { RouteService } from '../../services/route.service';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { debug } from 'util';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import leaflet from 'leaflet';
import L from 'leaflet';
import '../../../geocoder/Control.Geocoder';

declare let window: any;

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.page.html',
  styleUrls: ['./single-route.page.scss']
})
export class SingleRoutePage implements OnInit {
  public singleRouteForm: FormGroup;
  selectedFile: File = null;
  route: SurfRoute = new SurfRoute();
  id: string;
  currentUserId: string;
  currentUser: SurfUser;
  viewMode: boolean = true;

  constructor(
    private formBuilder: FormBuilder /* private imagePicker: ImagePicker*/,
    private activatedRoute: ActivatedRoute,
    private routesService: RouteService,
    public navCtrl: NavController,
    public authService: AuthService,
    private userService: UserService
  ) {
    window.route = this;
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.singleRouteForm = this.formBuilder.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      routeStartLocation: ['', Validators.required],
      routeEndLocation: [''],
      routeStartGeolocation: ['', Validators.required],
      routeEndGeolocation: [''],
      imagesUrls: [[], Validators.required],
      mapUrl: [''],
      lengthKM: [0, Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      //TODO: add ability to rank the route (for all users, also in VIEW mode)
      routeDifficulty: ['', Validators.required],
      routeDuration: [0, Validators.required],
      routeDurationUnits: ['hours'],
      routeProperties: [''],
      isGuidingOffered: [''],
      offeredPrice: [0],
      guideContactDetails: [''],
      entranceFee: 0,
      requiredEquipment: [''],
      recommendedMonths: ['']
      //TODO make sure numEventsCreatedFromRoute is updated!
    });

    window.form = this.singleRouteForm;

    this.currentUserId = this.authService.currentUserId;
    this.currentUser = await this.userService.getCurrentUserPromise();
    // await this.userService.getuser(this.currentUserId).subscribe(user => {
    //     debugger;
    //     this.currentUser = user;
    //     console.log('currentUser: ' + this.currentUser);
    // });

    console.log('this.currentUser: ', this.currentUser);
    if (this.id) {
      await this.routesService.getRoute(this.id).subscribe(async r => {
        if (r) {
          this.route = r;

          if (!this.route.routeCreatorId) {
            this.route.routeCreatorId = this.currentUserId; // safety
          }

          console.log(
            'Getting route-creator-id with is of ' + this.route.routeCreatorId
          );
          await this.userService
            .getuser(this.route.routeCreatorId)
            .subscribe(user => {
              this.route.routeCreator = user;
            });
          debugger;
          if (this.route.routeCreatorId !== this.currentUserId) {
            this.singleRouteForm.disable();
            this.viewMode = true;
            console.log('just changed to view mode');
          }

          //this.route.routeCreator = await this.userService.getuser(this.route.routeCreatorId).toPromise();
          this.editForm(this.route);
        } else {
          alert('route does not exist');
          this.navCtrl.navigateForward('SingleRoute');
        }
      });
    } else {
      this.route.routeCreatorId = this.currentUserId;
      this.route.routeCreator = this.currentUser;

      // defaults
      // this.route.name = 'route name';
      this.route.country = 'Israel';
      this.route.state = 'Israel';

      // this.route.routeStartLocation = 'Zeelim parking';
      // this.route.routeEndLocation = 'Namer spring';
      this.route.routeStartGeolocation = '';
      // this.route.routeEndGeolocation = '';
      // this.route.imagesUrls = ['file-name-here?'];
      // this.route.mapUrl = 'https://he.wikipedia.org/wiki/%D7%A0%D7%97%D7%9C_%D7%A6%D7%90%D7%9C%D7%99%D7%9D#/media/File:NahalTzeelim01_ST_04.jpg';
      // this.route.lengthKM = 8;
      // this.route.shortDescription = 'חול אבנים ועוד חול';
      // this.route.longDescription = 'kuk kuu aksu adkscu';
      // this.route.routeRanking = [{ranking: 3, review: 'nice'}];
      this.route.routeDifficulty = '3'; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
      // this.route.routeDuration = 1; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
      this.route.routeProperties = []; // ['water', 'desert', 'canyon']; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

      // this.route.routeCreatorId = 'hgf6yi9';
      // this.route.routeCreator = {firstName: 'Tidhar', lastName: 'Seifer', isGuide: true}; //new User(); // {id: 'hgf6yi9', name: 'Adi'};
      this.route.isGuidingOffered = false;
      this.route.offeredPrice = 0; // default 0, more if isGuidingOffered
      // this.route.guideContactDetails = '0541223681'; // ree text allowing the guide to describe email and/or phone for contacting him/her about guidance
      this.route.entranceFee = 0;
      // this.route.requiredEquipment = 'shoes, pancake';
      // this.route.numEventsCreatedFromRoute = 59689;
      this.route.recommendedMonths = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ];

      this.editForm(this.route);
    }

    //TODO: What about route-ranks? we should remember who ranked it and allow only one rank from same user to same route
  }

  editForm(route: SurfRoute) {
    // route -> form   (Populating the form)
    let durationUnits = 'hours';
    let duration = route.routeDuration;
    if (duration >= 24) {
      duration /= 24;
      durationUnits = 'days';
    }

    this.singleRouteForm.patchValue({
      name: route.name,
      country: route.country,
      state: route.state,
      routeStartLocation: route.routeStartLocation,
      routeEndLocation: route.routeEndLocation,
      routeStartGeolocation: route.routeStartGeolocation,
      routeEndGeolocation: route.routeEndGeolocation,
      imagesUrls: route.imagesUrls,
      mapUrl: route.mapUrl,
      lengthKM: route.lengthKM,
      shortDescription: route.shortDescription,
      longDescription: route.longDescription,
      routeDifficulty: route.routeDifficulty,
      routeDuration: duration,
      routeDurationUnits: durationUnits,
      routeProperties: route.routeProperties,
      isGuidingOffered: route.isGuidingOffered,
      offeredPrice: route.offeredPrice,
      guideContactDetails: route.guideContactDetails,
      entranceFee: route.entranceFee,
      requiredEquipment: route.requiredEquipment,
      recommendedMonths: route.recommendedMonths
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.value;
    console.log(this.selectedFile);
    // checking the file isn't null
  }

  onUpload() {
    let desc = '';
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    //TODO: upload phooto to server
    //TODO: imageId = Get the link to that photo or ID of that
    //TODO: make sure to delete previous photo first (if we support single photo meanwhile)
    //TODO: this.route.imagesUrls.push(imageId)
    console.log(fd);
  }

  onMapUpload() {
    let desc = '';
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    //TODO: upload photo to server
    //TODO: imageId = Get the link to that photo or ID of that
    //TODO: this.route.mapUrl = imageId;
    console.log(fd);
  }
  async updateRoute() {
    this.mapFormValuesToRouteModel();
    let copyOfRoute = _.cloneDeep(this.route);

    //delete junk that the DB shouldn't have
    delete copyOfRoute.routeCreator; //remove the property

    if (this.id) {
      //update
      await this.routesService.updateRoute(this.id, copyOfRoute);
      //TODO should navigate to a different page
    } else {
      const returnedId = await this.routesService.addRoute(copyOfRoute);
      if (returnedId) {
        this.id = returnedId;
      }
      //TODO should navigate to a different page?
    }
  }

  mapFormValuesToRouteModel() {
    //preperation of this.route
    this.route.name = this.singleRouteForm.value.name;
    this.route.country = this.singleRouteForm.value.country || '';
    this.route.state = this.singleRouteForm.value.state || '';
    this.route.routeStartLocation =
      this.singleRouteForm.value.routeStartLocation || '';
    this.route.routeEndLocation =
      this.singleRouteForm.value.routeEndLocation || '';
    this.route.routeStartGeolocation =
      this.singleRouteForm.value.routeStartGeolocation || '';
    this.route.routeEndGeolocation =
      this.singleRouteForm.value.routeEndGeolocation || '';
    this.route.imagesUrls = this.singleRouteForm.value.imagesUrls || '';
    this.route.mapUrl = this.singleRouteForm.value.mapUrl || '';
    this.route.lengthKM = this.singleRouteForm.value.lengthKM || '';
    this.route.shortDescription =
      this.singleRouteForm.value.shortDescription || '';
    this.route.longDescription =
      this.singleRouteForm.value.longDescription || '';
    this.route.routeDifficulty =
      this.singleRouteForm.value.routeDifficulty || '';

    let durationHours = this.singleRouteForm.value.routeDuration || 0;
    if (this.singleRouteForm.value.routeDurationUnits === 'days') {
      durationHours *= 24;
    }
    this.route.routeDuration = durationHours;
    this.route.routeProperties =
      this.singleRouteForm.value.routeProperties || '';
    this.route.isGuidingOffered =
      this.singleRouteForm.value.isGuidingOffered || false;
    this.route.offeredPrice = this.singleRouteForm.value.offeredPrice || 0;
    this.route.guideContactDetails =
      this.singleRouteForm.value.guideContactDetails || '';
    this.route.entranceFee = this.singleRouteForm.value.entranceFee || 0;
    this.route.requiredEquipment =
      this.singleRouteForm.value.requiredEquipment || '';
    this.route.recommendedMonths =
      this.singleRouteForm.value.recommendedMonths || [];
  }

  //if new routem first set the creatorId and get creator in any case



    //------------------------------------------------------------------------------------------
    // map region
    //------------------------------------------------------------------------------------------
    mapStart: any;
  mapEnd: any;

    ionViewDidEnter() {
        this.loadmapStart();
        this.loadmapEnd()
    }

    loadmapStart() {
        this.mapStart = leaflet.map('mapStart').fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapStart);
        var geocoder = L.Control.Geocoder.nominatim();
        var control = L.Control.geocoder({
            geocoder: geocoder
        }).on('markgeocode', (e) => {
            //debugger;
            this.singleRouteForm.patchValue({
                routeStartGeolocation : e.geocode.center.lat+','+e.geocode.center.lng,
                routeStartLocation: e.geocode.name
            });
        }).addTo(this.mapStart);

        this.mapStart.locate({
            setView: true,
            maxZoom: 10,
            timeout: 30000,
            maximumAge: 300000
        }).on('locationfound', (e) => {

            if (this.mapStart.SurfMarker)
                this.mapStart.removeLayer(this.mapStart.SurfMarker);
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            this.mapStart.addLayer(markerGroup);
            this.mapStart.SurfMarker = markerGroup;
            this.mapStart.surfLatLng = e.latlng;
            let location = '';
            geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results)=> {
                var r = results[0];
                if (r) {
                    location =  r.name;
                }
                this.singleRouteForm.patchValue({
                    routeStartGeolocation : this.mapStart.surfLatLng.lat+','+this.mapStart.surfLatLng.lng,
                    routeStartLocation: location
                });
            })
        }).on('locationerror', (err) => {
            console.log(err.message);
        });
        this.mapStart.on('click', (e) => {
            if (this.mapStart.SurfMarker)
                this.mapStart.removeLayer(this.mapStart.SurfMarker);
            this.mapStart.surfLatLng = e.latlng;
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            e.sourceTarget.addLayer(markerGroup);
            this.mapStart.SurfMarker = markerGroup;
            let location = '';
            geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results)=> {
                var r = results[0];
                if (r) {
                    location =  r.name;
                }
                this.singleRouteForm.patchValue({
                    routeStartGeolocation : this.mapStart.surfLatLng.lat+','+this.mapStart.surfLatLng.lng,
                    routeStartLocation: location
                });
            })
        });
    }

    loadmapEnd() {
        this.mapEnd = leaflet.map('mapEnd').fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapEnd);
        var geocoder = L.Control.Geocoder.nominatim();
        var control = L.Control.geocoder({
            geocoder: geocoder
        }).on('markgeocode', (e) => {
          //debugger;
            this.singleRouteForm.patchValue({
                routeEndGeolocation : e.geocode.center.lat+','+e.geocode.center.lng,
                routeEndLocation: e.geocode.name
            });
        }).addTo(this.mapEnd);


        this.mapEnd.locate({
            setView: true,
            maxZoom: 10,
            timeout: 30000,
            maximumAge: 300000
        }).on('locationfound', (e) => {

            if (this.mapEnd.SurfMarker)
                this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            this.mapEnd.addLayer(markerGroup);
            this.mapEnd.SurfMarker = markerGroup;
            this.mapEnd.surfLatLng = e.latlng;
            let location = '';
            geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results)=> {
                var r = results[0];
                if (r) {
                    location =  r.name;
                }
                this.singleRouteForm.patchValue({
                    routeEndGeolocation : this.mapEnd.surfLatLng.lat+','+this.mapEnd.surfLatLng.lng,
                    routeEndLocation: location
                });
            })
        }).on('locationerror', (err) => {
            console.log(err.message);
        });

        this.mapEnd.on('click', (e) => {
            if (this.mapEnd.SurfMarker)
                this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
            this.mapEnd.surfLatLng = e.latlng;
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            e.sourceTarget.addLayer(markerGroup);
            this.mapEnd.SurfMarker = markerGroup;
            let location = '';
            geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results)=> {
                var r = results[0];
                if (r) {
                    location =  r.name;
                }
                this.singleRouteForm.patchValue({
                    routeEndGeolocation : this.mapEnd.surfLatLng.lat+','+this.mapEnd.surfLatLng.lng,
                    routeEndLocation: location
                });
            })

        });
    }
}
