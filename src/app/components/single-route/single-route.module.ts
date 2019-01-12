import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SingleRouteReviewsPage } from '../single-route-reviews/single-route-reviews.page';
import { IonicModule } from '@ionic/angular';
import { SingleRoutePage } from './single-route.page';
import { RouteImageComponentModule } from '../route-image/route-image.module';
import { ToolbarComponentModule } from '../toolbar/toolbar.module';
import {RatingComponentModule} from '../rating/rating.module';
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
    ToolbarComponentModule,
      RatingComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SingleRoutePage, SingleRouteReviewsPage],
  entryComponents: [SingleRouteReviewsPage]
})
export class SingleRoutePageModule {}
