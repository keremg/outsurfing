import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { ImagePicker } from '@ionic-native/image-picker';
import { CreateTripPage } from './create-trip.page';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: CreateTripPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,

    RouterModule.forChild(routes)
  ],
  declarations: [CreateTripPage]
})
export class CreateTripPageModule {}
