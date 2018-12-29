import {Component, OnInit} from '@angular/core';
import {
    AlertController,
    LoadingController,
    NavController
} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmailValidator} from '../../../validators/email';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {Observable} from 'rxjs';

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
    uploadPercent: Observable<number>;
    profileUrl: Observable<string | null>;
     constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private storage: AngularFireStorage
    ) {
        window.user = this;
        
    }

    async ngOnInit() {
        this.currentUser = await this.userService.getCurrentUserPromise();
        this.currentUserId = this.authService.currentUserId;
        const ref = this.storage.ref('users/'+this.currentUser.id+'/profilePic');
        this.profileUrl = ref.getDownloadURL();
        this.updateForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            firstName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            lastName: ['', Validators.compose([Validators.minLength(1), Validators.required])],
            phone: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.required])],
            gender: [''],
            isGuide: [''],
            about: [''],

            birthDate: [''],
            tripLevel: [''],
            tripDuration: [''],
            peopleType: [''],
        });

        window.form = this.updateForm;
        console.log('this.currentUser: ', this.currentUser);
        this.editForm(this.currentUser);

        
    }
    
    editForm(user: SurfUser) {
        this.updateForm.patchValue({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            recentLocation: user.recentLocation,
            about: user.about,
            cancellations: user.cancellations,
            gender: user.gender, //0 is male, 1 is female, 2 is other
            isGuide: user.isGuide,
            phone: user.phone,
            birthDate: user.birthDate,
            tripDifficulties: user.tripDifficulties, // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
            tripDurations: user.tripDurations, //will represent number of days, so half day should be 0.5 , one hour should be 0.04
            audienceTypes: user.audienceTypes,
            travelerRatings: user.travelerRatings,//can be changed to
            guideRatings:user.guideRatings


        })
    
    }


    async updateUser() {
        if (!this.updateForm.valid) {
            console.log(
                `Need to complete the form, current value: ${this.updateForm.value}`
            );
        } else {
            const email: string = this.updateForm.value.email;
            const password: string = this.updateForm.value.password;
            let success = false;
            try {
                this.loading = await this.loadingCtrl.create();
                this.loading.present();
                let user = await this.authService.emailSignup(email, password);
                await this.loading.dismiss();

                let u = {
                    email: this.updateForm.value.email,
                    firstName: this.updateForm.value.firstName,
                    lastName: this.updateForm.value.lastName,
                    recentLocation: this.updateForm.value.recentLocation,
                    phone: this.updateForm.value.phone,
                    gender: parseInt(this.updateForm.value.gender.value),
                    isGuide: this.updateForm.value.isGuide == 'true',
                    about: this.updateForm.value.about,
                    cancellations: 0,
                    birthDate: this.updateForm.value.birthDate,
                    tripDifficulties: this.updateForm.value.tripDifficulties,
                    tripDurations: this.updateForm.value.tripDurations,
                    audienceTypes: this.updateForm.value.audienceTypes,
                    travelerRatings: this.updateForm.value.travelerRatings,
                    guideRatings: this.updateForm.value.guideRatings
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


    async uploadFile(event) {
        debugger;
        const file = event.target.files[0];
        const filePath = 'users/'+this.currentUser.id+'/profilePic';
        const task: AngularFireUploadTask = this.storage.upload(filePath, file);

        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        return task;
    }

}
