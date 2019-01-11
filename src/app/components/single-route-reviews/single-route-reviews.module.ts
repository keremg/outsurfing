import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { IonicModule } from '@ionic/angular';
import { RatingComponent } from '../rating/rating.component';
import { SingleRouteReviewsPage } from './single-route-reviews.page';

const routes: Routes = [
  {
    path: '',
    component: SingleRouteReviewsPage
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
  declarations: [SingleRouteReviewsPage, RatingComponent]
})
export class SingleRouteReviewsPageModule {}
