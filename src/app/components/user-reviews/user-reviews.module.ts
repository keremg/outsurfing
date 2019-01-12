import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { IonicModule } from '@ionic/angular';
import { UserReviewsPage } from './user-reviews.page';
import {RatingComponentModule} from '../rating/rating.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouteImageComponentModule,
      RatingComponentModule
  ],
  declarations: [UserReviewsPage],
    exports: [UserReviewsPage]
})
export class UserReviewsPageModule {}
