import {Component, ElementRef, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {
    AlertController,
    LoadingController,
    NavController
} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmailValidator} from '../../../validators/email';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {AudienceTypeEnum} from '../../AudienceType.enum';
import leaflet from 'leaflet';
import L from 'leaflet';
import '../../../geocoder/Control.Geocoder';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
    public signupForm: FormGroup;
    public loading;
    audienceTypeEnum = this.getENUM(AudienceTypeEnum);

    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        formBuilder: FormBuilder,
        private userService: UserService
    ) {
        this.signupForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            firstName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            phone: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.required])],
            gender: [''],
            isGuide: [''],
            about: [''],
            birthDate: [''],
            tripDifficulties: [''],
            tripDurations: [''],
            audienceTypes: [''],
            travelerRatings: [''],
            guideRatings: ['']
        });
    }

    async signupUser() {
        if (!this.signupForm.valid) {
            console.log(
                `Need to complete the form, current value: ${this.signupForm.value}`
            );
        } else {
            const email: string = this.signupForm.value.email;
            const password: string = this.signupForm.value.password;
            let success = false;
            try {
                this.loading = await this.loadingCtrl.create();
                this.loading.present();
                let user = await this.authService.emailSignup(email, password);
                await this.loading.dismiss();

                let u = {
                    email: this.signupForm.value.email,
                    firstName: this.signupForm.value.firstName,
                    lastName: this.signupForm.value.lastName,
                    recentLocation: this.map.surfLatLng.lat + ',' + this.map.surfLatLng.lng,
                    phone: this.signupForm.value.phone,
                    gender: parseInt(this.signupForm.value.gender.value),
                    isGuide: this.signupForm.value.isGuide == 'true',
                    about: this.signupForm.value.about,
                    cancellations: 0,
                    birthDate: this.signupForm.value.birthDate,
                    tripDifficulties: this.signupForm.value.tripDifficulties,
                    tripDurations: this.signupForm.value.tripDurations,
                    audienceTypes: this.signupForm.value.audienceTypes,
                    travelerRatings: this.signupForm.value.travelerRatings,
                    guideRatings: this.signupForm.value.guideRatings,
                };

                await this.userService.addUsers(u);
                success = true;
            } catch (error) {
                try {
                    await this.authService.deleteCurrentUser();
                } catch (error) {
                }

                this.loading.dismiss().then(async () => {
                    const alert = await this.alertCtrl.create({
                        message: 'Sign up faild:' + error.message,
                        buttons: [{text: 'Ok', role: 'cancel'}]
                    });
                    alert.present();
                });
            }
            if (success)
                this.navCtrl.navigateRoot('home');
        }
    }


    getENUM(ENUM: any): string[] {
        let myEnum = [];
        let objectEnum = Object.keys(ENUM);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            myEnum.push({key: keys[i], value: values[i]});
        }
        return myEnum;
    }



    //------------------------------------------------------------------------------------------
    // map region
    //------------------------------------------------------------------------------------------
    map: any;

    ionViewDidEnter() {
        this.loadmap();
    }

    loadmap() {
        this.map = leaflet.map('map').fitWorld();
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(this.map);
        var geocoder = L.Control.Geocoder.nominatim();
        var control = L.Control.geocoder({
            geocoder: geocoder
        }).addTo(this.map);

        this.map.locate({
            setView: true,
            maxZoom: 10,
            timeout: 30000,
            maximumAge: 300000
        }).on('locationfound', (e) => {

            if (this.map.SurfMarker)
                this.map.removeLayer(this.map.SurfMarker);
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            this.map.addLayer(markerGroup);
            this.map.SurfMarker = markerGroup;
            this.map.surfLatLng = e.latlng;
        }).on('locationerror', (err) => {
            console.log(err.message);
        });
        this.map.on('click', (e) => {
            if (this.map.SurfMarker)
                this.map.removeLayer(this.map.SurfMarker);
            this.map.surfLatLng = e.latlng;
            let markerGroup = leaflet.featureGroup();
            let marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).on('click', () => {
                //alert('Marker clicked');
            });
            markerGroup.addLayer(marker);
            e.sourceTarget.addLayer(markerGroup);
            this.map.SurfMarker = markerGroup;
        });
    }




}

