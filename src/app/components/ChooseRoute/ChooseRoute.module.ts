import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { ChooseRoute } from './ChooseRoute.page';
import {RouteImageComponentModule} from '../route-image/route-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
      RouteImageComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChooseRoute
      }
    ])
  ],
  declarations: [ChooseRoute]
})
export class ChooseRoutePageModule {}
