import {Component, OnInit} from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { EmailValidator } from '../../../validators/email';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-SignIn',
  templateUrl: 'SignIn.page.html',
  styleUrls: ['SignIn.page.scss'],

})
export class SignInPage implements OnInit{
  public loginForm: FormGroup;
  public loading;

  constructor(
    public navCtrl: NavController,
    public loadingController: LoadingController,
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

  ngOnInit(): void {


  }

    goToSignup():void {
    this.navCtrl.navigateForward('SignUp', true);
  }

  goToResetPassword():void {
    this.navCtrl.navigateForward('ResetPassword',true);
  }

  async loginUser() {
      this.authService.whenLoggedIn().asObservable().subscribe((b) => {
          if(b) {
              this.navCtrl.navigateForward('home', true);
          }
      });

    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.loading = await this.loadingController.create({
      message: 'Hellooo',
      duration: 2000
    });
      this.authService.emailLogin(email, password).then(
        async (authData) => {
          await this.loading.dismiss().then(async () => {
            await this.navCtrl.navigateRoot('home');
          });
        },
        async (error) =>  {
          await this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );

      return await this.loading.present();
    }
  }
}
