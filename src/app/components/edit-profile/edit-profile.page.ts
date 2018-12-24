import { Component , OnInit } from '@angular/core';
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


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public signupForm: FormGroup;
  public loading;
  public email: string;
  
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
      userName: ["", Validators.compose([Validators.minLength(3), Validators.required])],
      phone: ["", Validators.compose([Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.required])],
      gender: [""],
      isGuide: [""],
      about: [""],

      birthDate: [""],
      tripLevel: [""],
      tripDuration: [""],
      peopleType: [""],
    });
  }
  ngOnInit(){
   let user = this.authService.getCurrentUser();
   console.log(user)
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
          recentLocation: this.signupForm.value.recentLocation,
          imagesUrls: this.signupForm.value.imagesUrls,
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
        };

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

}
