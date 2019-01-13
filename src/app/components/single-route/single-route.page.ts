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
  ModalController,
  NavController
} from '@ionic/angular';
import { debug } from 'util';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import leaflet from 'leaflet';
import L from 'leaflet';
import '../../../geocoder/Control.Geocoder';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { CompressImageService } from '../../services/compress-image.service';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs';
import { SingleRouteReviewsPage } from '../single-route-reviews/single-route-reviews.page';
import {forEach} from '@angular-devkit/schematics';
import {SeasonsEnum} from '../../enums/Seasons.enum';

declare let window: any;

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.page.html',
  styleUrls: ['./single-route.page.scss']
})
export class SingleRoutePage implements OnInit {
  public singleRouteForm: FormGroup;
  selectedPhotos: File[] = [];
  selectedMapsPhotos: File[] = [];

  route: SurfRoute = new SurfRoute();
  id: string;
  currentUserId: string;
  currentUser: SurfUser;
  viewMode: boolean = false;
  photos: string = '';
  mapPhotos: string = '';

  photoIndex: number = 0;
  photoMapIndex: number = 0;

  loading: HTMLIonLoadingElement;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routesService: RouteService,
    public navCtrl: NavController,
    public authService: AuthService,
    private userService: UserService,
    private storage: AngularFireStorage,
    public loadingController: LoadingController,
    public compressImageService: CompressImageService,
    private modalController: ModalController
  ) {
    window.route = this;
  }

  async ionViewDidEnter() {}

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
      // imagesUrls: [[], Validators.required],
      // mapImagesUrl: [[]],
      lengthKM: [0, Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      //TODO: add ability to rank the route (for all users, also in VIEW mode)
      routeDifficulty: [0, Validators.required],
      routeDuration: [0, Validators.required],
      routeDurationUnits: ['hours'],
      routeProperties: [''],
      isGuidingOffered: [''],
      offeredPrice: [0],
      minGroupSizeForGuide: [0],
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
      this.route.routeCreator = Observable.of(this.currentUser);

      this.route.imagesUrls = [];
      this.route.mapImagesUrl = [];

      // defaults
      // this.route.name = 'route name';
      this.route.country = 'Israel';
      this.route.state = 'Israel';

      // this.route.routeStartLocation = 'Zeelim parking';
      // this.route.routeEndLocation = 'Namer spring';
      this.route.routeStartGeolocation = '';
      // this.route.routeEndGeolocation = '';
      // this.route.imagesUrls = ['file-name-here?'];
      // this.route.mapImagesUrl = ['https://he.wikipedia.org/wiki/%D7%A0%D7%97%D7%9C_%D7%A6%D7%90%D7%9C%D7%99%D7%9D#/media/File:NahalTzeelim01_ST_04.jpg'];
      // this.route.lengthKM = 8;
      // this.route.shortDescription = 'חול אבנים ועוד חול';
      // this.route.longDescription = 'kuk kuu aksu adkscu';
      // this.route.routeRanking = [{ranking: 3, review: 'nice'}];
      this.route.routeDifficulty = 3; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
      // this.route.routeDuration = 1; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
      this.route.routeProperties = []; // ['water', 'desert', 'canyon']; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

      // this.route.routeCreatorId = 'hgf6yi9';
      // this.route.routeCreator = {firstName: 'Tidhar', lastName: 'Seifer', isGuide: true}; //new User(); // {id: 'hgf6yi9', name: 'Adi'};
      this.route.isGuidingOffered = false;
      this.route.offeredPrice = 0; // default 0, more if isGuidingOffered
      this.route.minGroupSizeForGuide = 0; //default 0, more if isGuidingOffered
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
      // imagesUrls: route.imagesUrls,
      // mapImagesUrl: route.mapImagesUrl,
      lengthKM: route.lengthKM,
      shortDescription: route.shortDescription,
      longDescription: route.longDescription,
      routeDifficulty: route.routeDifficulty,
      routeDuration: duration,
      routeDurationUnits: durationUnits,
      routeProperties: route.routeProperties,
      isGuidingOffered: route.isGuidingOffered,
      offeredPrice: route.offeredPrice,
      minGroupSizeForGuide: route.minGroupSizeForGuide,
      guideContactDetails: route.guideContactDetails,
      entranceFee: route.entranceFee,
      requiredEquipment: route.requiredEquipment,
      recommendedMonths: route.recommendedMonths
    });
    this.loadmapStart();
    this.loadmapEnd();
  }

  onImageSelected(event) {
    this.selectedPhotos.push(event.target.files[0]);
    if (this.photos.length > 0) {
      this.photos = this.photos + ',';
    }
    this.photos = this.photos.concat(event.target.files[0].name);

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.width = 130;
        img.setAttribute('float-left', 'true');
        const div = document.createElement('div');
        div.setAttribute('float-left', 'true');
        div.appendChild(img);
        document.getElementById('previewPhotos').appendChild(div);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    // checking the file isn't null
  }

  onMapImageSelected(event) {
    this.selectedMapsPhotos.push(event.target.files[0]);
    if (this.mapPhotos.length > 0) {
      this.mapPhotos = this.mapPhotos + ',';
    }
    this.mapPhotos = this.mapPhotos.concat(event.target.files[0].name);

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.width = 130;
        const div = document.createElement('div');
        div.appendChild(img);
        document.getElementById('previewMapPhotos').appendChild(div);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    // checking the file isn't null
  }

  openLoadingController() {
    this.loadingController
      .create({
        message: 'Saving, please wait...'
      })
      .then(res => {
        this.loading = res;
        this.loading.present();
      });
  }
  closeLoadingController() {
    this.loadingController.dismiss().then();
  }

  async updateRoute(eventIt: boolean) {
    this.openLoadingController();

    this.mapFormValuesToRouteModel();
    const copyOfRoute = _.cloneDeep(this.route);

    //delete junk that the DB shouldn't have
    delete copyOfRoute.routeCreator; //remove the property
    let returnedId;
    if (!this.viewMode) {
      if (this.id) {
        //update
        await this.routesService.updateRoute(this.id, copyOfRoute);
        returnedId = this.id;
      }
      if (!returnedId) { // Add
        returnedId = await this.routesService.addRoute(copyOfRoute);
      }
      this.id = returnedId;

      console.log('Before uploadPhotos');
      await this.uploadPhotos(copyOfRoute); //both regular photos and maps-photos
      console.log('After uploadPhotos, about to navigate');
      this.closeLoadingController();
    }

    if (eventIt) {
      //TODO should event it
      this.navCtrl.navigateForward('EventDetail/0/' + this.id);
    } else {
      //this.navCtrl.navigateForward('ChooseRoute');
      //this.ngOnInit().then();
      this.navCtrl.navigateRoot('SingleRoute/' +this.id+'/0')
    }
  }

  async deleteRoute() {
    if (!this.viewMode && this.id) {
      await this.routesService.deleteRoute(this.id);
    }
    return this.navCtrl.navigateRoot('ChooseRoute');
  }

  async uploadPhotos(copyOfRoute): Promise<boolean> {
    let i = 0;
    if (this.selectedPhotos.length > 0) {
      let paths = [];
      for (const file of this.selectedPhotos) {
        const filePath =
          'routes/' + this.id + '/' + new Date().getTime() + '_' + i;
        console.log('About to upload image: ' + filePath);
        //const task: AngularFireUploadTask = this.storage.upload(filePath, file);
        //await task;
        let res: any = await this.compressImageService.saveImage(
          file,
          filePath,
          this
        );
        console.log('Finished to upload image: ' + filePath);
        paths.push(filePath);
        i++;
      }
      if (copyOfRoute.imagesUrls) {
        paths = paths.concat(copyOfRoute.imagesUrls);
      }
      this.route.imagesUrls = paths;
      console.log('About to update route with imageUrls: ' + paths);
      await this.routesService.updateRoute(this.id, { imagesUrls: paths });
      console.log('Finished to update route with imageUrls: ' + paths);
    }

    //Now upload maps-photos:
    if (this.selectedMapsPhotos.length > 0) {
      let paths = [];
      for (const file of this.selectedMapsPhotos) {
        const filePath =
          'routes/' + this.id + '/' + new Date().getTime() + '_' + i;
        //const task: AngularFireUploadTask = this.storage.upload(filePath, file);
        //await task;
        let res: any = await this.compressImageService.saveImage(
          file,
          filePath,
          this
        );
        paths.push(filePath);
        i++;
      }
      if (copyOfRoute.mapImagesUrl) {
        paths = paths.concat(copyOfRoute.mapImagesUrl);
      }
      this.route.mapImagesUrl = paths;
      console.log('About to update route with mapImagesUrl: ' + paths);
      await this.routesService.updateRoute(this.id, { mapImagesUrl: paths });
      console.log('Finished to update route with mapImagesUrl: ' + paths);
    }
    console.log('Finished CuploadPhoto()');
    return true;
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
    // this.route.imagesUrls = this.singleRouteForm.value.imagesUrls || [];
    // this.route.mapImagesUrl = this.singleRouteForm.value.mapImagesUrl || [];
    this.route.lengthKM = this.singleRouteForm.value.lengthKM || '';
    this.route.shortDescription =
      this.singleRouteForm.value.shortDescription || '';
    this.route.longDescription =
      this.singleRouteForm.value.longDescription || '';
    this.route.routeDifficulty =
      this.singleRouteForm.value.routeDifficulty || 0;



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
    this.route.minGroupSizeForGuide =
      this.singleRouteForm.value.minGroupSizeForGuide || 0;
    this.route.guideContactDetails =
      this.singleRouteForm.value.guideContactDetails || '';
    this.route.entranceFee = this.singleRouteForm.value.entranceFee || 0;
    this.route.requiredEquipment =
      this.singleRouteForm.value.requiredEquipment || '';
    this.route.recommendedMonths =
      this.singleRouteForm.value.recommendedMonths || [];
    this.route.seasons = this.getSeasonsFromMonths(this.route.recommendedMonths);
  }

  //if new routem first set the creatorId and get creator in any case

  //------------------------------------------------------------------------------------------
  // map region
  //------------------------------------------------------------------------------------------
  mapStart: any;
  mapEnd: any;

  loadmapStart() {
    if (this.mapStart) {
      this.mapStart.remove();
    }
    this.mapStart = leaflet.map('mapStart').fitWorld();
    this.mapStart.scrollWheelZoom.disable();
    leaflet
      .tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributions:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      })
      .addTo(this.mapStart);
    if (!this.viewMode) {
      var geocoder = L.Control.Geocoder.nominatim();
      var control = L.Control.geocoder({
        geocoder: geocoder
      })
        .on('markgeocode', e => {
          this.singleRouteForm.patchValue({
            routeStartGeolocation:
              e.geocode.center.lat + ',' + e.geocode.center.lng,
            routeStartLocation: e.geocode.name
          });
        })
        .addTo(this.mapStart);

      if (!this.id) {
        this.mapStart
          .locate({
            setView: true,
            maxZoom: 10,
            timeout: 30000,
            maximumAge: 300000
          })
          .on('locationfound', e => {
            if (this.mapStart.SurfMarker)
              this.mapStart.removeLayer(this.mapStart.SurfMarker);
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet
              .marker([e.latitude, e.longitude])
              .on('click', () => {
                //alert('Marker clicked');
              });
            markerGroup.addLayer(marker);
            this.mapStart.addLayer(markerGroup);
            this.mapStart.SurfMarker = markerGroup;
            this.mapStart.surfLatLng = e.latlng;
            let location = '';
            geocoder.reverse(
              e.latlng,
              this.mapStart.options.crs.scale(this.mapStart.getZoom()),
              results => {
                var r = results[0];
                if (r) {
                  location = r.name;
                }
                this.singleRouteForm.patchValue({
                  routeStartGeolocation:
                    this.mapStart.surfLatLng.lat +
                    ',' +
                    this.mapStart.surfLatLng.lng,
                  routeStartLocation: location,
                  country: r.properties.address.country,
                  state: r.properties.address.state
                });
              }
            );
          })
          .on('locationerror', err => {
            console.log(err.message);
          });
      }

      this.mapStart.on('click', e => {
        if (this.mapStart.SurfMarker)
          this.mapStart.removeLayer(this.mapStart.SurfMarker);
        this.mapStart.surfLatLng = e.latlng;
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet
          .marker([e.latlng.lat, e.latlng.lng])
          .on('click', () => {
            //alert('Marker clicked');
          });
        markerGroup.addLayer(marker);
        e.sourceTarget.addLayer(markerGroup);
        this.mapStart.SurfMarker = markerGroup;
        let location = '';
        geocoder.reverse(
          e.latlng,
          this.mapStart.options.crs.scale(this.mapStart.getZoom()),
          results => {
            var r = results[0];
            if (r) {
              location = r.name;
            }
            this.singleRouteForm.patchValue({
              routeStartGeolocation:
                this.mapStart.surfLatLng.lat +
                ',' +
                this.mapStart.surfLatLng.lng,
              routeStartLocation: location,
              country: r.properties.address.country,
              state: r.properties.address.state
            });
          }
        );
      });
    }

    if (this.id && this.route.routeStartGeolocation) {
      //loaded from db
      let loc = this.route.routeStartGeolocation.split(',');
      if (this.mapStart.SurfMarker)
        this.mapStart.removeLayer(this.mapStart.SurfMarker);
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker(loc).on('click', () => {
        //alert('Marker clicked');
      });
      markerGroup.addLayer(marker);
      this.mapStart.addLayer(markerGroup);
      this.mapStart.SurfMarker = markerGroup;
      this.mapStart.surfLatLng = { lat: loc[0], lng: loc[1] };

      this.mapStart.setView(loc, 10);
    }
    document.getElementById('startGeoMap').hidden = true;
  }

  loadmapEnd() {
    if (this.mapEnd) {
      this.mapEnd.remove();
    }
    this.mapEnd = leaflet.map('mapEnd').fitWorld();
    this.mapEnd.scrollWheelZoom.disable();
    leaflet
      .tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributions:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      })
      .addTo(this.mapEnd);
    if (!this.viewMode) {
      var geocoder = L.Control.Geocoder.nominatim();
      var control = L.Control.geocoder({
        geocoder: geocoder
      })
        .on('markgeocode', e => {
          this.singleRouteForm.patchValue({
            routeEndGeolocation:
              e.geocode.center.lat + ',' + e.geocode.center.lng,
            routeEndLocation: e.geocode.name
          });
        })
        .addTo(this.mapEnd);
      this.mapEnd.on('click', e => {
        if (this.mapEnd.SurfMarker)
          this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
        this.mapEnd.surfLatLng = e.latlng;
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet
          .marker([e.latlng.lat, e.latlng.lng])
          .on('click', () => {
            //alert('Marker clicked');
          });
        markerGroup.addLayer(marker);
        e.sourceTarget.addLayer(markerGroup);
        this.mapEnd.SurfMarker = markerGroup;
        let location = '';
        geocoder.reverse(
          e.latlng,
          this.mapEnd.options.crs.scale(this.mapEnd.getZoom()),
          results => {
            var r = results[0];
            if (r) {
              location = r.name;
            }
            this.singleRouteForm.patchValue({
              routeEndGeolocation:
                this.mapEnd.surfLatLng.lat + ',' + this.mapEnd.surfLatLng.lng,
              routeEndLocation: location
            });
          }
        );
      });
    }

    if (this.id && this.route.routeEndGeolocation) {
      //loaded from db
      let loc = this.route.routeEndGeolocation.split(',');
      if (this.mapEnd.SurfMarker)
        this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker(loc).on('click', () => {
        //alert('Marker clicked');
      });
      markerGroup.addLayer(marker);
      this.mapEnd.addLayer(markerGroup);
      this.mapEnd.SurfMarker = markerGroup;
      this.mapEnd.surfLatLng = { lat: loc[0], lng: loc[1] };

      this.mapEnd.setView(loc, 10);
    }
    document.getElementById('endGeoMap').hidden = true;
  }

  routeImageUrl() {
    return this.route.imagesUrls[0];
  }

  plusStartText: any = '+';
  plusEndText: any = '+';

  onPlusStartMap() {
    document.getElementById('startGeo').hidden = !document.getElementById(
      'startGeo'
    ).hidden;
    document.getElementById('startGeoMap').hidden = !document.getElementById(
      'startGeoMap'
    ).hidden;
    this.plusStartText === '+'
      ? (this.plusStartText = '-')
      : (this.plusStartText = '+');
    this.mapStart.invalidateSize();
  }

  onPlusEndMap() {
    document.getElementById('endGeo').hidden = !document.getElementById(
      'endGeo'
    ).hidden;
    document.getElementById('endGeoMap').hidden = !document.getElementById(
      'endGeoMap'
    ).hidden;
    this.plusEndText === '+'
      ? (this.plusEndText = '-')
      : (this.plusEndText = '+');
    this.mapEnd.invalidateSize();
  }

  async onShow() {
    const modal = await this.modalController.create({
      component: SingleRouteReviewsPage,
      componentProps: { routeId: this.id }
    });
    return await modal.present();
  }

    private getSeasonsFromMonths(months: string[]) {
      let res = [];
      for(let month of months){
          if(!(res.includes(SeasonsEnum[1])) && (month =="12" || month == "1" || month == "2")){
              res.push(SeasonsEnum[1])
          }
          if(!(res.includes(SeasonsEnum[2])) && (month =="3" || month == "4" || month == "5")){
              res.push(SeasonsEnum[2])
          }
          if(!(res.includes(SeasonsEnum[3])) && (month =="6" || month == "7" || month == "8")){
              res.push(SeasonsEnum[3])
          }
          if(!(res.includes(SeasonsEnum[4])) && (month =="9" || month == "10" || month == "11")){
              res.push(SeasonsEnum[4])
          }
      }
        return res;
    }
}
