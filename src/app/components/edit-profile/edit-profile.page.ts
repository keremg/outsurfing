import {Component, OnInit} from '@angular/core';
import {CompressImageService} from '../../services/compress-image.service';
import {
    AlertController,
    LoadingController, ModalController,
    NavController
} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmailValidator} from '../../../validators/email';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {debug} from 'util';
import {map} from 'rxjs/operators';
import {ErrorFn} from 'firebase';
import {promise} from 'selenium-webdriver';
import {AudienceTypeEnum} from '../../AudienceType.enum';
import {DifficultiesEnum} from '../../enums/Difficulties.enum';
import {DurationEnum} from '../../enums/Duration.enum';
import {UserReviewsPage} from '../user-reviews/user-reviews.page';

declare let window: any;


@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
    public updateForm: FormGroup;
    public loading;
    currentUserId: string;
    currentUser: SurfUser;
    loadingElement: HTMLIonLoadingElement;
    audienceTypeEnum = this.getENUM(AudienceTypeEnum);
    uploadPercent: Observable<number>;
    profileUrl: string;
    difficultiesEnum = this.getENUM(DifficultiesEnum);
    durationEnum = this.getENUM(DurationEnum);
    guideButton: boolean = false;


    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private storage: AngularFireStorage,
        private modalController: ModalController,
        public compressImageService: CompressImageService,
        public loadingController: LoadingController
    ) {
        this.updateForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            email: [''],
            phone: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.required])],
            gender: [''],
            isGuide: [''],
            about: [''],

            birthDate: [''],
            tripLevel: [''],
            peopleType: [''],
            tripDurations: [''],
        });
        window.user = this;

    }

    async ngOnInit() {
        this.currentUser = await this.userService.getCurrentUserPromise();
        this.currentUserId = this.authService.currentUserId;
        const ref = await this.storage.ref('users/' + this.currentUser.id + '/profilePic_Large');
        //this.profileUrl = ref.getDownloadURL();
        ref.getDownloadURL().toPromise().then(res => {
                this.profileUrl = res;
            },
            async error => {
                console.log(error);
                if (error.code === 'storage/object-not-found') {
                    const alert = await this.alertCtrl.create({
                        message: 'It seems you dont have a profile picture. consider uploading one:)',
                        buttons: [{text: 'ok'}]
                    });
                    alert.present();
                }
            });
        window.form = this.updateForm;
        console.log('this.currentUser: ', this.currentUser);
        this.editForm(this.currentUser);


    }

    editForm(user: SurfUser) {
        this.updateForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user.id,
            recentLocation: user.recentLocation,
            about: user.about,
            cancellations: user.cancellations,
            gender: user.gender.toString(), //0 is male, 1 is female, 2 is other
            isGuide: user.isGuide,
            phone: user.phone,
            birthDate: user.birthDate,
            tripLevel: user.tripDifficulties, // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
            tripDurations: user.tripDurations, //will represent number of days, so half day should be 0.5 , one hour should be 0.04
            peopleType: user.audienceTypes
        });
    }


    async updateUser() {
        try {
            if (!this.updateForm.valid) {
                console.log(
                    `Need to complete the form, current value: ${this.updateForm.value}`
                );
            } else {
                let success = false;
                try {
                    let u = {
                        email: this.currentUser.email,
                        firstName: this.updateForm.value.firstName,
                        lastName: this.updateForm.value.lastName,
                        recentLocation: '',
                        phone: this.updateForm.value.phone,
                        gender: parseInt(this.updateForm.value.gender),
                        isGuide: this.updateForm.value.isGuide,
                        about: this.updateForm.value.about,
                        birthDate: this.updateForm.value.birthDate,
                        tripDifficulties: this.updateForm.value.tripLevel,
                        tripDurations: this.updateForm.value.tripDurations,
                        audienceTypes: this.updateForm.value.peopleType
                    };
                    console.log(this.currentUserId, u);
                    await this.userService.updateUser(this.currentUserId, u);
                    success = true;
                    //this.navCtrl.navigateRoot('home');
                    this.ngOnInit().then();
                } catch (error) {
                    debugger;
                    success = false;
                }
            }
        } catch (error) {
            debugger;
        }
    }


    openLoadingController() {
        this.loadingController.create({
            message: 'Saving, please wait...'
        }).then(res => {
            this.loadingElement = res;
            this.loadingElement.present();
        });
    }

    closeLoadingController() {
        this.loadingController.dismiss().then();
    }

    async uploadFile(event) {
        this.openLoadingController();
        const file = event.target.files[0];
        const filePath = 'users/' + this.currentUser.id + '/profilePic';
        this.profileUrl = undefined;
        let res: any = await this.compressImageService.saveImage(file, filePath, this);
        //finished uploading and compressing
        this.closeLoadingController();
        if (res) {
            const ref = this.storage.ref('users/' + this.currentUser.id + '/profilePic_Large'); //without _Large for large image, need _Mediun or _Small for smaller versions
            let du = ref.getDownloadURL();
            du.pipe(map(url => {
                const timet = (new Date()).getTime();
                return url + '&ttt=' + timet; //against browser cache
            }));
            du.subscribe(res => {
                this.profileUrl = res;
            });
        }


        //const task: AngularFireUploadTask = this.storage.upload(filePath, compress);
        // observe percentage changes
        //this.uploadPercent = task.percentageChanges();
        //return task;

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

    async onShow() {
        this.guideButton = false;
        const modal = await this.modalController.create({
            component: UserReviewsPage,
            componentProps: { userId: this.currentUserId, button: this.guideButton }
        });
        return await modal.present();
    }

    async onShowGuide() {
        this.guideButton = true;
        const modal = await this.modalController.create({
            component: UserReviewsPage,
            componentProps: { userId: this.currentUserId, button: this.guideButton }
        });
        return await modal.present();
    }

    /*on_no_profile_pic(){
        if(error.code === 'storage/object-not-found'){
            const alert = await this.alertCtrl.create({
                message: 'It seems you dont have a profile picture. consider uploading one:)',
                buttons: [{text: 'ok'}]
            });
            alert.present();
        }
    }*/

}
