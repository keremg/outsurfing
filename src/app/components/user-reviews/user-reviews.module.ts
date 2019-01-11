import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { IonicModule } from '@ionic/angular';
import { RatingComponent } from '../rating/rating.component';
import { UserReviewsPage } from './user-reviews.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [UserReviewsPage, RatingComponent]
})
export class UserReviewsPageModule {}
