import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailValidator } from '../../../validators/email';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  public signupForm: FormGroup;
  public loading;

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
        let user = await this.authService.signupUser(email, password);
        await this.loading.dismiss();

        let u: User = {
          email: this.signupForm.value.email,
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          userName: this.signupForm.value.userName,
          phone: this.signupForm.value.phone,
          gender: parseInt(this.signupForm.value.gender.value),
          isGuide: this.signupForm.value.isGuide == 'true',
          about: this.signupForm.value.about,
          cancellations: 0
          // birthDate:  this.signupForm.value.birthDate;
          // tripLevel: this.signupForm.value.tripLevel;
          // tripDuration: this.signupForm.value.tripDuration;
          // peopleType: this.signupForm.value.peopleType;
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

}
