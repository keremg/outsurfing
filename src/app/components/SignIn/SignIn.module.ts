import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SignInPage } from './SignIn.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
      ToolbarComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignInPage
      }
    ])
  ],
  declarations: [SignInPage]
})
export class SignInModule {}
