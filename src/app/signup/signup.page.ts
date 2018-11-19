import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthService } from '../auth.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading;

  Testuser = {
    firstName: "adi",
    lastName: "caspi"
  };
  users:User[];
  user:User;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder,
    private userService:UserService
  ) {
    this.signupForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
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

    this.authService.signupUser(email, password).then(
      user => {
        this.loading.dismiss().then(async () => {
          this.addUser(this.authService.getCurrentUser());


          await this.navCtrl.navigateRoot('');
        });
      },
      error => {
        this.loading.dismiss().then(async () => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: "cancel" }]
          });
          await alert.present();
        });
      }
    );
    this.loading = await this.loadingCtrl.create();
    await this.loading.present();
  }
}

  addUser (user: any){
    //this.userService.addUsers(user);
    }

}
