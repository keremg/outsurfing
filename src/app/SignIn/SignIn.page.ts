import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthService } from '../auth.service';
import { HomePageModule } from '../home/home.module';
@Component({
  selector: 'app-SignIn',
  templateUrl: 'SignIn.page.html',
  styleUrls: ['SignIn.page.scss'],

})
export class SignInPage {
  public loginForm: FormGroup;
  public loading;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  goToSignup():void {
    this.navCtrl.navigateForward('SignupPage');//TODO
  }

  goToResetPassword():void {
    this.navCtrl.navigateForward('ResetPasswordPage');//TODO
  }

  loginUser():void {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.loginUser(email, password).then(
        authData => {
          this.loading.dismiss().then(async () => {
            this.navCtrl.navigateRoot('home');
          });
        },
        error =>  {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
