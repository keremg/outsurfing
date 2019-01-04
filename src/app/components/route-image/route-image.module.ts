import { NgModule } from '@angular/core';

import {RouteImageComponent} from './route-image.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ChooseRoute} from '../ChooseRoute/ChooseRoute.page';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
  declarations: [RouteImageComponent],
    exports: [
        RouteImageComponent
    ]
})
export class RouteImageComponentModule {}
