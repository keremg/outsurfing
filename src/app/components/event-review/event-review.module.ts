import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventReviewPage } from './event-review.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';
import {RouteImageComponentModule} from '../route-image/route-image.module';
import {RouteImageComponent} from '../route-image/route-image.component';
import {RatingComponentModule} from '../rating/rating.module';

const routes: Routes = [
  {
    path: '',
    component: EventReviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      ToolbarComponentModule,
      RatingComponentModule,
      RouterModule.forChild(routes),
      RouteImageComponentModule
  ],
  declarations: [EventReviewPage,RouteImageComponent]
})
export class EventReviewPageModule {}
