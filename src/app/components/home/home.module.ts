import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { RouteImageComponent } from '../route-image/route-image.component';
import {RouteImageComponentModule} from '../route-image/route-image.module';
import {SharedModule} from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      RouteImageComponentModule,
      SharedModule,
      RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  entryComponents: []
})
export class HomePageModule {}
