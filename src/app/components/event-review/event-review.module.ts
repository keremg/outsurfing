import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventReviewPage } from './event-review.page';
import {RatingComponent} from '../rating/rating.component';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';

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
      RouterModule.forChild(routes)
  ],
  declarations: [EventReviewPage, RatingComponent]
})
export class EventReviewPageModule {}
