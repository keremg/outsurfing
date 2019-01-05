import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {JoinEventPage} from '../join-event/join-event.page';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../services/event.service';
import {RouteService} from '../../services/route.service';
import {SurfEvent} from '../../models/surfEvent';
import {SurfRoute} from '../../models/surfRoute';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurfUser} from '../../models/surfUser';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import * as _ from 'lodash';
import leaflet from 'leaflet';
import L from 'leaflet';
import '../../../geocoder/Control.Geocoder';
import {AudienceTypeEnum} from '../../AudienceType.enum';
import {forEach} from '@angular-devkit/schematics';
import {SurfParticipant} from '../../models/surfParticipant';
import {Observable, Subscription} from 'rxjs';
import {ParticipantApprovalPage} from '../participant-approval/participant-approval.page';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


declare let window: any;

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
    audienceTypeEnum = this.getENUM(AudienceTypeEnum);
    public singleEventForm: FormGroup;
    selectedFile: File = null;
    route: SurfRoute = new SurfRoute();
    id: string;
    currentUser: SurfUser;
    viewMode = false;
    routeId: string;
    event: SurfEvent;
    eventObs: Observable<SurfEvent>;
    selectedPhotos: File[] = [];
    selectedMapsPhotos: File[] = [];
    photos: string = '';
    mapPhotos: string = '';

    private eventSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder /* private imagePicker: ImagePicker*/,
        private activatedRoute: ActivatedRoute,
        private routesService: RouteService,
        public navCtrl: NavController,
        public authService: AuthService,
        private userService: UserService,
        private modalController: ModalController,
        private eventService: EventService,
        private routeService: RouteService,
        private storage: AngularFireStorage
    ) {
        window.event = this;
    }


    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.id === '0') {
            delete this.id;
        }
        this.routeId = this.activatedRoute.snapshot.paramMap.get('route');
        if (this.routeId === '0') {
            delete this.routeId;
        }
        this.singleEventForm = this.formBuilder.group({
            name: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            routeStartLocation: ['', Validators.required],
            routeEndLocation: [''],
            routeStartGeolocation: ['', Validators.required],
            routeEndGeolocation: [''],
            imagesUrls: [[], Validators.required],
            mapImagesUrl: [[]],
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
            recommendedMonths: [''],

            meetingLocation: ['', Validators.required],
            meetingGeolocation: [''],
            meetingTime: ['', Validators.required],
            routeStartTime: ['', Validators.required],
            returnTime: ['', Validators.required],
            audienceType: [[]],
            isGuidedEvent: [false],
            priceOfEvent: [0],
            organizerContactDetails: ['', Validators.required],
            isEventRequiresCars: [true],
            //TODO make sure numEventsCreatedFromRoute is updated!
        });
        window.form = this.singleEventForm;

        this.currentUser = await this.userService.getCurrentUserPromise();


        if (this.id) {
            this.eventObs = this.eventService.getEvent(this.id);
            this.eventSubscription = this.eventObs.subscribe(value => {
                if (value) {
                    this.event = value;
                    this.loadFromEvent(this.event);//todo should be read only?

                } else {
                    alert('event does not exist');
                    this.navCtrl.navigateBack('home');

                }
            });
        } else if (this.routeId) {
            this.routeService.getRoute(this.routeId).subscribe(value => {
                if (value) {
                    this.loadFromRoute(value);
                } else {
                    //TODO go back
                    alert('route does not exist');
                    this.navCtrl.navigateBack('ChooseRoute');
                }
            });

        }
    }


    async loadFromEvent(event: SurfEvent) {
        //TODO
        this.removeElement('create');
        //TODO: get event from db, then should add the orgznizer details:

        this.event = event;

        if (!this.event.eventOrganizerId) {
            this.event.eventOrganizerId = this.currentUser.id; // safety
        }

        //this.event.routeCreator = await this.userService.getuser(this.event.routeCreatorId).toPromise();
        //this.event.eventOrganizer = await this.userService.getuser(this.event.eventOrganizerId).toPromise();

        this.editForm(this.event);

        if (this.event.eventOrganizerId !== this.currentUser.id) {
            this.singleEventForm.disable();
            this.viewMode = true;
            this.removeElement('save');
            this.removeElement('approve');
            this.removeElement('delete');
            console.log('just changed to view mode');
            this.event.participant.subscribe(pars => {
                let joined: boolean = false;
                if(pars){
                    pars.forEach( par =>{
                        if(par.id === this.currentUser.id)
                            joined = true;
                    });
                }

                if(joined){
                    this.removeElement('join');
                }
                else{
                    this.removeElement('leave');
                }
            })
        }
        else{
            this.removeElement('join');
            this.removeElement('leave');
        }
    }

    removeElement(id: string){

        let ele = document.getElementById(id);
        if(ele) {
            ele.parentNode.removeChild(ele);
        }
        else{
            console.log(id);
        }
    }

    async loadFromRoute(route: SurfRoute) {
        //should hide the join button
        this.removeElement('join');
        this.removeElement('save');
        this.removeElement('leave');
        this.removeElement('approve');
        this.removeElement('delete');

        this.event = new SurfEvent(route);

        this.event.eventOrganizerId = this.currentUser.id;
        this.event.eventOrganizer = this.currentUser;

        //this.event.routeCreator = await this.userService.getuser(this.event.routeCreatorId).toPromise();
        ////this.event.eventOrganizer = await this.userService.getuser(this.event.eventOrganizerId).toPromise();


        // TODO: defaults



        await this.userService
            .getuser(this.event.eventOrganizerId)
            .subscribe(user => {
                this.event.eventOrganizer = user;
            });
        this.editForm(this.event);


        //TODO

    }



    async onDelete() {
        this.eventSubscription.unsubscribe();
        await this.eventService.deleteEvent(this.id).then(data => {
            this.navCtrl.navigateRoot('home');
        });

    }



    async updateEvent(isStayOnPage: boolean) {
        const copyOfEvent =this.getEventObject();//getting event from from after cleanups

        //delete junk that the DB shouldn't have
        let returnedId;
        if (!this.viewMode && this.id) {
            //update
            await this.eventService.updateEvent(this.id, copyOfEvent);
            returnedId = this.id;
        }
        if (!returnedId) {
            returnedId = await this.eventService.addEvent(copyOfEvent);
        }
        this.id = returnedId;
        this.uploadPhotos(copyOfEvent); //both regular photos and maps-photos

        const modal = await this.modalController.create({
            component: JoinEventPage,
            componentProps: {eventId: returnedId}
        });

        if (!isStayOnPage) {
            this.navCtrl.navigateRoot('home');
        }

        /*modal.onDidDismiss().then(data => {
            if (data.data) {
                this.navCtrl.navigateRoot('home');
            } else {
                //this.eventService.deleteEvent(returnedId);
            }
        }).catch(data => {
            //this.eventService.deleteEvent(returnedId);
        });
        modal.present();*/
    }





    async onJoinEvent() {
        const modal = await this.modalController.create({
            component: JoinEventPage,
            componentProps: {eventId: this.id}
        });
        modal.onDidDismiss().then(data => {
            if (data) {
                this.navCtrl.navigateRoot('home');
            }
        })
        return modal.present();
    }

    async onApprove() {
        await this.updateEvent(true);
        const modal = await this.modalController.create({
            component: ParticipantApprovalPage,
            componentProps: {eventId: this.id, eventOrganizer: this.event.eventOrganizerId}
        });
        return modal.present();
    }

    async onLeaveEvent() {
        await this.eventService.leaveEvent(this.id, this.currentUser.id);
        return this.navCtrl.navigateRoot('home');
    }

    private getEventObject() {
        this.mapFormValuesToEventModel();
        const copyOfEvent = _.cloneDeep(this.event);

        //delete junk that the DB shouldn't have
        delete copyOfEvent.eventOrganizer; //remove the property
        if (copyOfEvent.routeCreator) {
            delete copyOfEvent.routeCreator;
            delete copyOfEvent.eventOrganizer;
        }
        return copyOfEvent;
    }

    editForm(event: SurfEvent) {
        // event -> form   (Populating the form)
        let durationUnits = 'hours';
        let duration = event.routeDuration;
        if (duration >= 24) {
            duration /= 24;
            durationUnits = 'days';
        }

        this.singleEventForm.patchValue({
            name: event.name,
            country: event.country,
            state: event.state,
            routeStartLocation: event.routeStartLocation,
            routeEndLocation: event.routeEndLocation,
            routeStartGeolocation: event.routeStartGeolocation,
            routeEndGeolocation: event.routeEndGeolocation,
            imagesUrls: event.imagesUrls,
            mapImagesUrl: event.mapImagesUrl,
            lengthKM: event.lengthKM,
            shortDescription: event.shortDescription,
            longDescription: event.longDescription,
            routeDifficulty: event.routeDifficulty,
            routeDuration: duration,
            routeDurationUnits: durationUnits,
            routeProperties: event.routeProperties,
            isGuidingOffered: event.isGuidingOffered,
            offeredPrice: event.offeredPrice,
            guideContactDetails: event.guideContactDetails,
            entranceFee: event.entranceFee,
            requiredEquipment: event.requiredEquipment,
            recommendedMonths: event.recommendedMonths,

            meetingLocation: event.meetingLocation,
            meetingGeolocation: event.meetingGeolocation,
            meetingTime: event.meetingTime,
            routeStartTime: event.routeStartTime,
            returnTime: event.returnTime,
            audienceType: event.audienceType,
            isGuidedEvent: event.isGuidedEvent,
            priceOfEvent: event.priceOfEvent,
            organizerContactDetails: event.organizerContactDetails,
            isEventRequiresCars: event.isEventRequiresCars

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
                img.height = 300;
                img.width = 400;
                const div = document.createElement('div');
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
                img.height = 300;
                img.width = 400;
                const div = document.createElement('div');
                div.appendChild(img);
                document.getElementById('previewMapPhotos').appendChild(div);
            };

            reader.readAsDataURL(event.target.files[0]);
        }
        // checking the file isn't null
    }


    async uploadPhotos(copyOfEvent) {
        if (this.selectedPhotos.length > 0) {
            let i = 0;
            let paths = [];
            for (const file of this.selectedPhotos) {
                const filePath = 'routes/' + this.id + '/' + (new Date()).getTime();
                const task: AngularFireUploadTask = this.storage.upload(filePath, file);
                await task;
                paths.push(filePath);
                i++;
            }
            if (copyOfEvent.imagesUrls) {
                paths = paths.concat(copyOfEvent.imagesUrls);
            }
            this.route.imagesUrls = paths;
            await this.eventService.updateEvent(this.id, {imagesUrls: paths});
        }

        //Now upload maps-photos:
        if (this.selectedMapsPhotos.length > 0) {
            let i = 0;
            let paths = [];
            for (const file of this.selectedMapsPhotos) {
                const filePath = 'routes/' + this.id + '/' + (new Date()).getTime();
                const task: AngularFireUploadTask = this.storage.upload(filePath, file);
                await task;
                paths.push(filePath);
                i++;
            }
            if (copyOfEvent.mapImagesUrl) {
                paths = paths.concat(copyOfEvent.mapImagesUrl);
            }
            this.route.mapImagesUrl = paths;
            await this.eventService.updateEvent(this.id, {mapImagesUrl: paths});
        }
    }

    // onUpload() {
    //     let desc = '';
    //     const fd = new FormData();
    //     fd.append('image', this.selectedFile, this.selectedFile.name);
    //     //TODO: upload phooto to server
    //     //TODO: imageId = Get the link to that photo or ID of that
    //     //TODO: make sure to delete previous photo first (if we support single photo meanwhile)
    //     //TODO: this.route.imagesUrls.push(imageId)
    //     console.log(fd);
    // }


    mapFormValuesToEventModel() {
        //preperation of this.route
        this.event.name = this.singleEventForm.value.name;
        this.event.country = this.singleEventForm.value.country || '';
        this.event.state = this.singleEventForm.value.state || '';
        this.event.routeStartLocation =
            this.singleEventForm.value.routeStartLocation || '';
        this.event.routeEndLocation =
            this.singleEventForm.value.routeEndLocation || '';
        this.event.routeStartGeolocation =
            this.singleEventForm.value.routeStartGeolocation || '';
        this.event.routeEndGeolocation =
            this.singleEventForm.value.routeEndGeolocation || '';
        this.event.imagesUrls = this.singleEventForm.value.imagesUrls || [];
        this.event.mapImagesUrl = this.singleEventForm.value.mapImagesUrl || [];
        this.event.lengthKM = this.singleEventForm.value.lengthKM || '';
        this.event.shortDescription =
            this.singleEventForm.value.shortDescription || '';
        this.event.longDescription =
            this.singleEventForm.value.longDescription || '';
        this.event.routeDifficulty =
            this.singleEventForm.value.routeDifficulty || '';

        let durationHours = this.singleEventForm.value.routeDuration || 0;
        if (this.singleEventForm.value.routeDurationUnits === 'days') {
            durationHours *= 24;
        }
        this.event.routeDuration = durationHours;
        this.event.routeProperties =
            this.singleEventForm.value.routeProperties || '';
        this.event.isGuidingOffered =
            this.singleEventForm.value.isGuidingOffered || false;
        this.event.offeredPrice = this.singleEventForm.value.offeredPrice || 0;

        this.event.guideContactDetails =
            this.singleEventForm.value.guideContactDetails || '';
        this.event.entranceFee = this.singleEventForm.value.entranceFee || 0;
        this.event.requiredEquipment =
            this.singleEventForm.value.requiredEquipment || '';
        this.event.recommendedMonths =
            this.singleEventForm.value.recommendedMonths || [];


        this.event.meetingLocation =
            this.singleEventForm.value.meetingLocation || '';
        this.event.meetingGeolocation =
            this.singleEventForm.value.meetingGeolocation || '';
        this.event.meetingTime =
            this.singleEventForm.value.meetingTime || '';
        this.event.routeStartTime =
            this.singleEventForm.value.routeStartTime || '';
        this.event.returnTime =
            this.singleEventForm.value.returnTime || '';
        this.event.audienceType =
            this.singleEventForm.value.audienceType || '';
        this.event.isGuidedEvent =
            this.singleEventForm.value.isGuidedEvent || '';
        this.event.priceOfEvent =
            this.singleEventForm.value.priceOfEvent || 0;
        this.event.organizerContactDetails =
            this.singleEventForm.value.organizerContactDetails || '';
        this.event.isEventRequiresCars =
            this.singleEventForm.value.isEventRequiresCars || false;
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
        this.mapStart.scrollWheelZoom.disable();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapStart);
        if (!this.viewMode) {
            const geocoder = L.Control.Geocoder.nominatim();
            const control = L.Control.geocoder({
                geocoder: geocoder
            }).on('markgeocode', (e) => {
                this.singleEventForm.patchValue({
                    routeStartGeolocation: e.geocode.center.lat + ',' + e.geocode.center.lng,
                    routeStartLocation: e.geocode.name
                });
            }).addTo(this.mapStart);

            if (!this.event.routeStartGeolocation) {
                this.mapStart.locate({
                    setView: true,
                    maxZoom: 10,
                    timeout: 30000,
                    maximumAge: 300000
                }).on('locationfound', (e) => {

                    if (this.mapStart.SurfMarker) {
                        this.mapStart.removeLayer(this.mapStart.SurfMarker);
                    }
                    const markerGroup = leaflet.featureGroup();
                    const marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
                        //alert('Marker clicked');
                    });
                    markerGroup.addLayer(marker);
                    this.mapStart.addLayer(markerGroup);
                    this.mapStart.SurfMarker = markerGroup;
                    this.mapStart.surfLatLng = e.latlng;
                    let location = '';
                    geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results) => {
                        const r = results[0];
                        if (r) {
                            location = r.name;
                        }
                        this.singleEventForm.patchValue({
                            routeStartGeolocation: this.mapStart.surfLatLng.lat + ',' + this.mapStart.surfLatLng.lng,
                            routeStartLocation: location,
                            country: r.properties.address.country,
                            state: r.properties.address.state
                        });
                    });
                }).on('locationerror', (err) => {
                    console.log(err.message);
                });
            }

            this.mapStart.on('click', (e) => {
                if (this.mapStart.SurfMarker) {
                    this.mapStart.removeLayer(this.mapStart.SurfMarker);
                }
                this.mapStart.surfLatLng = e.latlng;
                const markerGroup = leaflet.featureGroup();
                const marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).on('click', () => {
                    //alert('Marker clicked');
                });
                markerGroup.addLayer(marker);
                e.sourceTarget.addLayer(markerGroup);
                this.mapStart.SurfMarker = markerGroup;
                let location = '';
                geocoder.reverse(e.latlng, this.mapStart.options.crs.scale(this.mapStart.getZoom()), (results) => {
                    const r = results[0];
                    if (r) {
                        location = r.name;
                    }
                    this.singleEventForm.patchValue({
                        routeStartGeolocation: this.mapStart.surfLatLng.lat + ',' + this.mapStart.surfLatLng.lng,
                        routeStartLocation: location,
                        country: r.properties.address.country,
                        state: r.properties.address.state
                    });
                });
            });
        }

        if (this.event.routeStartGeolocation) { // loaded from db
            const loc = this.event.routeStartGeolocation.split(',');
            if (this.mapStart.SurfMarker) {
                this.mapStart.removeLayer(this.mapStart.SurfMarker);
            }
            const markerGroup = leaflet.featureGroup();
            const marker: any = leaflet.marker(loc).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            this.mapStart.addLayer(markerGroup);
            this.mapStart.SurfMarker = markerGroup;
            this.mapStart.surfLatLng = {lat: loc[0], lng: loc[1]};

            this.mapStart.setView(loc, 10);
        }
    }

    loadmapEnd() {
        this.mapEnd = leaflet.map('mapEnd').fitWorld();
        this.mapEnd.scrollWheelZoom.disable();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.mapEnd);
        if (!this.viewMode) {
            const geocoder = L.Control.Geocoder.nominatim();
            const control = L.Control.geocoder({
                geocoder: geocoder
            }).on('markgeocode', (e) => {
                this.singleEventForm.patchValue({
                    routeEndGeolocation: e.geocode.center.lat + ',' + e.geocode.center.lng,
                    routeEndLocation: e.geocode.name
                });
            }).addTo(this.mapEnd);
            if (!this.event.routeEndGeolocation) {
                this.mapEnd.locate({
                    setView: true,
                    maxZoom: 10,
                    timeout: 30000,
                    maximumAge: 300000
                }).on('locationfound', (e) => {

                    if (this.mapEnd.SurfMarker) {
                        this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
                    }
                    const markerGroup = leaflet.featureGroup();
                    const marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
                        // alert('Marker clicked');
                    });
                    markerGroup.addLayer(marker);
                    this.mapEnd.addLayer(markerGroup);
                    this.mapEnd.SurfMarker = markerGroup;
                    this.mapEnd.surfLatLng = e.latlng;
                    let location = '';
                    geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results) => {
                        const r = results[0];
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
                if (this.mapEnd.SurfMarker) {
                    this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
                }
                this.mapEnd.surfLatLng = e.latlng;
                const markerGroup = leaflet.featureGroup();
                const marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).on('click', () => {
                    //alert('Marker clicked');
                });
                markerGroup.addLayer(marker);
                e.sourceTarget.addLayer(markerGroup);
                this.mapEnd.SurfMarker = markerGroup;
                let location = '';
                geocoder.reverse(e.latlng, this.mapEnd.options.crs.scale(this.mapEnd.getZoom()), (results) => {
                    const r = results[0];
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

        if (this.event.routeEndGeolocation) { // loaded from db
            const loc = this.event.routeEndGeolocation.split(',');
            if (this.mapEnd.SurfMarker) {
                this.mapEnd.removeLayer(this.mapEnd.SurfMarker);
            }
            const markerGroup = leaflet.featureGroup();
            const marker: any = leaflet.marker(loc).on('click', () => {
                // alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            this.mapEnd.addLayer(markerGroup);
            this.mapEnd.SurfMarker = markerGroup;
            this.mapEnd.surfLatLng = {lat: loc[0], lng: loc[1]};

            this.mapEnd.setView(loc, 10);
        }
    }

    openOriginalRoute() {
        const res = confirm('Are you sure you want to open the Route. It will discard any changes you might have made in the event');
        if (res) {
            window.open('SingleRoute/' + this.event.routeId, '_blank');
        }
    }

    getENUM(ENUM: any): string[] {
        const myEnum = [];
        const objectEnum = Object.keys(ENUM);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            myEnum.push({key: keys[i], value: values[i]});
        }
        return myEnum;
    }

}
