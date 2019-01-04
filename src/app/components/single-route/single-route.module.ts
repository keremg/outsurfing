import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { ImagePicker } from '@ionic-native/image-picker';
import { SingleRoutePage } from './single-route.page';
import {RouteImageComponentModule} from '../route-image/route-image.module';

const routes: Routes = [
  {
    path: '',
    component: SingleRoutePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouteImageComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SingleRoutePage]
})
export class SingleRoutePageModule {}
