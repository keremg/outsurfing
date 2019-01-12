import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { IonicModule } from '@ionic/angular';

import { ViewProfilePage } from './view-profile.page';
import { UserReviewsPage } from '../user-reviews/user-reviews.page';
import { ToolbarComponentModule } from '../toolbar/toolbar.module';
import {RatingComponentModule} from '../rating/rating.module';
import {UserReviewsPageModule} from '../user-reviews/user-reviews.module';
const routes: Routes = [
  {
    path: '',
    component: ViewProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouteImageComponentModule,
    ToolbarComponentModule,
      RatingComponentModule,
      UserReviewsPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewProfilePage],
  entryComponents: [UserReviewsPage]
})
export class ViewProfilePageModule {}
