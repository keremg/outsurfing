import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { IonicModule } from '@ionic/angular';
import { UserReviewsPage } from './user-reviews.page';
import {RatingComponentModule} from '../rating/rating.module';

const routes: Routes = [
  {
    path: '',
    component: UserReviewsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouteImageComponentModule,
      RatingComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserReviewsPage]
})
export class UserReviewsPageModule {}
