import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {JoinEventPage} from '../join-event/join-event.page';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../services/event.service';
import {RouteService} from '../../services/route.service';
import {SurfEvent} from '../../models/surfEvent'
import {SurfRoute} from '../../models/surfRoute';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurfUser} from '../../models/surfUser';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import * as _ from 'lodash';
import leaflet from 'leaflet';
import L from 'leaflet';
import '../../../geocoder/Control.Geocoder';

declare let window: any;

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
    public singleEventForm: FormGroup;
    selectedFile: File = null;
    route: SurfRoute = new SurfRoute();
    id: string;
    currentUserId: string;
    currentUser: SurfUser;
    viewMode: boolean = false;
    routeId:string;
    event: SurfEvent;

    constructor(
        private formBuilder: FormBuilder /* private imagePicker: ImagePicker*/,
        private activatedRoute: ActivatedRoute,
        private routesService: RouteService,
        public navCtrl: NavController,
        public authService: AuthService,
        private userService: UserService,
        private modalController:ModalController,
        private eventService: EventService,
        private routeService: RouteService,
    ) {
        window.route = this;
    }


    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.routeId = this.activatedRoute.snapshot.paramMap.get('route');

        this.singleEventForm = this.formBuilder.group({
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
        window.form = this.singleEventForm;

        this.currentUserId = this.authService.currentUserId;
        this.currentUser = await this.userService.getCurrentUserPromise();


        if(this.id && this.id !== '0') {
            this.eventService.getEvent(this.id).subscribe(value => {
                if (value) {
                    this.event = value;
                    this.loadFromEvent(this.event);//todo should be read only?
                } else {
                    alert('event does not exist')
                    this.navCtrl.navigateBack('home');

                }
            });
        }
        else if(this.routeId)
        {
            this.routeService.getRoute(this.routeId).subscribe(value => {
                if( value) {
                    this.route = value;
                    this.loadFromRoute(this.route);
                }
                else{
                    //TODO go back
                    alert('route does not exist')
                    this.navCtrl.navigateBack('ChooseRoute');
                }
            });

        }
    }



    async loadFromEvent(event: SurfEvent) {
        //TODO
        document.getElementById('create').style.visibility='hidden';

        //TODO: get event from db, then should add the orgznizer details:

        this.event = event;

        if (!this.event.eventOrgnizerId) {
            this.event.eventOrgnizerId = this.currentUserId; // safety
        }

        //this.route.routeCreator = await this.userService.getuser(this.route.routeCreatorId).toPromise();
        this.editForm(this.event);

        await this.userService
            .getuser(this.route.routeCreatorId)
            .subscribe(user => {
                this.route.routeCreator = user;
            });

        if (this.event.eventOrgnizerId !== this.currentUserId) {
            this.singleEventForm.disable();
            this.viewMode = true;
            console.log('just changed to view mode');
        }
        alert('old event')
    }

    async loadFromRoute(route: SurfRoute) {
        //should hide the join button
        document.getElementById('join').style.visibility='hidden';
        alert('create a new event form route')
        this.route = route;
        this.event = new SurfEvent(route);

        this.event.eventOrgnizerId = this.currentUserId;
        this.event.eventOrgnizer = this.currentUser;

        // TODO: defaults


        this.editForm(this.event);

        //TODO

    }

    async onCreate(){
        this.mapFormValuesToRouteModel();
        let copyOfEvent = _.cloneDeep(this.event);

        //delete junk that the DB shouldn't have
        delete copyOfEvent.eventOrgnizerId; //remove the property
        let returnedId;
        if (!this.viewMode && this.id) {
            //update
            await this.eventService.updateEvent(this.id, copyOfEvent);
            returnedId = this.id;
        }
        if(!returnedId) {
            returnedId = await this.eventService.addEvent(copyOfEvent);
        }
        this.navCtrl.navigateForward('home');

        this.eventService.addEvent(this.event);
        this.navCtrl.navigateRoot('home');
    }

    async onJoinEvent(){
        const modal = await this.modalController.create({
            component: JoinEventPage,
            componentProps: { eventId: this.id }
        });
        return await modal.present();
    }

    editForm(route: SurfEvent) {
        // route -> form   (Populating the form)
        let durationUnits = 'hours';
        let duration = route.routeDuration;
        if (duration >= 24) {
            duration /= 24;
            durationUnits = 'days';
        }

        this.singleEventForm.patchValue({
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
        this.loadmapStart();
        this.loadmapEnd();
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

    mapFormValuesToRouteModel() {
        //preperation of this.route
        this.route.name = this.singleEventForm.value.name;
        this.route.country = this.singleEventForm.value.country || '';
        this.route.state = this.singleEventForm.value.state || '';
        this.route.routeStartLocation =
            this.singleEventForm.value.routeStartLocation || '';
        this.route.routeEndLocation =
            this.singleEventForm.value.routeEndLocation || '';
        this.route.routeStartGeolocation =
            this.singleEventForm.value.routeStartGeolocation || '';
        this.route.routeEndGeolocation =
            this.singleEventForm.value.routeEndGeolocation || '';
        this.route.imagesUrls = this.singleEventForm.value.imagesUrls || '';
        this.route.mapUrl = this.singleEventForm.value.mapUrl || '';
        this.route.lengthKM = this.singleEventForm.value.lengthKM || '';
        this.route.shortDescription =
            this.singleEventForm.value.shortDescription || '';
        this.route.longDescription =
            this.singleEventForm.value.longDescription || '';
        this.route.routeDifficulty =
            this.singleEventForm.value.routeDifficulty || '';

        let durationHours = this.singleEventForm.value.routeDuration || 0;
        if (this.singleEventForm.value.routeDurationUnits === 'days') {
            durationHours *= 24;
        }
        this.route.routeDuration = durationHours;
        this.route.routeProperties =
            this.singleEventForm.value.routeProperties || '';
        this.route.isGuidingOffered =
            this.singleEventForm.value.isGuidingOffered || false;
        this.route.offeredPrice = this.singleEventForm.value.offeredPrice || 0;
        this.route.guideContactDetails =
            this.singleEventForm.value.guideContactDetails || '';
        this.route.entranceFee = this.singleEventForm.value.entranceFee || 0;
        this.route.requiredEquipment =
            this.singleEventForm.value.requiredEquipment || '';
        this.route.recommendedMonths =
            this.singleEventForm.value.recommendedMonths || [];
    }

    //if new routem first set the creatorId and get creator in any case


    //------------------------------------------------------------------------------------------
    // map region
    //------------------------------------------------------------------------------------------
    mapStart: any;
    mapEnd: any;

    ionViewDidEnter() {
    }

    loadmapStart() {
        this.mapStart = leaflet.map('mapStart').fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapStart);
        if(!this.viewMode) {
            var geocoder = L.Control.Geocoder.nominatim();
            var control = L.Control.geocoder({
                geocoder: geocoder
            }).on('markgeocode', (e) => {
                this.singleEventForm.patchValue({
                    routeStartGeolocation: e.geocode.center.lat + ',' + e.geocode.center.lng,
                    routeStartLocation: e.geocode.name
                });
            }).addTo(this.mapStart);

            if(!this.id) {
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
                    geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results) => {
                        var r = results[0];
                        if (r) {
                            location = r.name;
                        }
                        this.singleEventForm.patchValue({
                            routeStartGeolocation: this.mapStart.surfLatLng.lat + ',' + this.mapStart.surfLatLng.lng,
                            routeStartLocation: location
                        });
                    });
                }).on('locationerror', (err) => {
                    console.log(err.message);
                });
            }

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
                geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results) => {
                    var r = results[0];
                    if (r) {
                        location = r.name;
                    }
                    this.singleEventForm.patchValue({
                        routeStartGeolocation: this.mapStart.surfLatLng.lat + ',' + this.mapStart.surfLatLng.lng,
                        routeStartLocation: location
                    });
                });
            });
        }

        if(this.id && this.route.routeStartGeolocation) {//loaded from db
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
            this.mapStart.surfLatLng = {lat:loc[0],lng:loc[1]};

            this.mapStart.flyTo(loc, 10)
        }
    }

    loadmapEnd() {
        this.mapEnd = leaflet.map('mapEnd').fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapEnd);
        if(!this.viewMode) {
            var geocoder = L.Control.Geocoder.nominatim();
            var control = L.Control.geocoder({
                geocoder: geocoder
            }).on('markgeocode', (e) => {
                //debugger;
                this.singleEventForm.patchValue({
                    routeEndGeolocation: e.geocode.center.lat + ',' + e.geocode.center.lng,
                    routeEndLocation: e.geocode.name
                });
            }).addTo(this.mapEnd);
            if(!this.id) {
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
                    geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results) => {
                        var r = results[0];
                        if (r) {
                            location = r.name;
                        }
                        this.singleEventForm.patchValue({
                            routeEndGeolocation: this.mapEnd.surfLatLng.lat + ',' + this.mapEnd.surfLatLng.lng,
                            routeEndLocation: location
                        });
                    });
                }).on('locationerror', (err) => {
                    console.log(err.message);
                });
            }
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
                geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results) => {
                    var r = results[0];
                    if (r) {
                        location = r.name;
                    }
                    this.singleEventForm.patchValue({
                        routeEndGeolocation: this.mapEnd.surfLatLng.lat + ',' + this.mapEnd.surfLatLng.lng,
                        routeEndLocation: location
                    });
                });

            });
        }

        if(this.id && this.route.routeEndGeolocation) {//loaded from db
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
            this.mapEnd.surfLatLng = {lat:loc[0],lng:loc[1]};

            this.mapEnd.flyTo(loc, 10)
        }
    }


}
