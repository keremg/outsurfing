import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { SignupPage } from './signup.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
      ToolbarComponentModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
