import {Component, Pipe, PipeTransform} from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailValidator } from '../../../validators/email';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SurfUser } from '../../models/surfUser';
import {AudienceTypeEnum}from '../../AudienceType.enum';

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
      email: ["", Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ["", Validators.compose([Validators.minLength(6), Validators.required])],
      firstName: ["", Validators.compose([Validators.minLength(1), Validators.required])],
      lastName: ["", Validators.compose([Validators.minLength(1), Validators.required])],
      phone: ["", Validators.compose([Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.required])],
      gender: [""],
      isGuide: [""],
      about: [""],
        recentLocation:[""],
        imagesUrls:[""],
      birthDate: [""],
        tripDifficulties: [""],
        tripDurations: [""],
        audienceTypes: [""],
        travelerRatings:[""],
        guideRatings:[""]
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
let success =false;
      try {
        this.loading = await this.loadingCtrl.create();
        this.loading.present();
        let user = await this.authService.emailSignup(email, password);
        await this.loading.dismiss();

        let u: SurfUser = {
          email: this.signupForm.value.email,
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          recentLocation: this.signupForm.value.recentLocation,//TODO
          imagesUrls: this.signupForm.value.imagesUrls,//TODO
          phone: this.signupForm.value.phone,
          gender: parseInt(this.signupForm.value.gender.value),
          isGuide: this.signupForm.value.isGuide == 'true',
          about: this.signupForm.value.about,
          cancellations: 0,
          birthDate:  this.signupForm.value.birthDate,
          tripDifficulties: this.signupForm.value.tripDifficulties,
          tripDurations: this.signupForm.value.tripDurations,
          audienceTypes: this.signupForm.value.audienceTypes,
          travelerRatings: this.signupForm.value.travelerRatings,
          guideRatings: this.signupForm.value.guideRatings
        }

        await this.userService.addUsers(u);
        success = true;
      }
      catch (error) {
        try {
          await this.authService.deleteCurrentUser();
        }
        catch (error) { }

        this.loading.dismiss().then(async () => {
          const alert = await this.alertCtrl.create({
            message: 'Sign up faild:'+error.message ,
            buttons: [{ text: "Ok", role: "cancel" }]
          });
          alert.present();
        });
      }
      if (success)
        this.navCtrl.navigateRoot('home');
    }
  }



    getENUM(ENUM:any): string[] {
        let myEnum = [];
        let objectEnum = Object.keys(ENUM);
        const values = objectEnum.slice( 0 , objectEnum.length / 2 );
        const keys = objectEnum.slice( objectEnum.length / 2 );

        for (let i = 0 ; i < objectEnum.length/2 ; i++ ) {
            myEnum.push( { key: keys[i], value: values[i] } );
        }
        return myEnum;
    }

}

