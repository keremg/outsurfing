import { Component } from "@angular/core";
import {
  AlertController,
  NavController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthService } from '../services/auth.service';

@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.page.html"
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.resetPasswordForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ]
    });
  }

  resetPassword(): void {
  if (!this.resetPasswordForm.valid) {
    console.log(
      `Form is not valid yet, current value: ${this.resetPasswordForm.value}`
    );
  } else {
    const email: string = this.resetPasswordForm.value.email;
    this.authService.resetPassword(email).then(
      async (user) => {
        const alert = await this.alertCtrl.create({
          message: "Check your email for a password reset link",
          buttons: [
            {
              text: "Ok",
              role: "cancel",
              handler: () => {
                this.navCtrl.navigateBack('');
              }
            }
          ]
        });
        await alert.present();
      },
      async (error) => {
        const errorAlert = await this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: "Ok", role: "cancel" }]
        });
        await errorAlert.present();
      }
    );
  }
}
}
