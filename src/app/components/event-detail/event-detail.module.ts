import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventDetailPage } from './event-detail.page';
import {JoinEventPage} from '../join-event/join-event.page';
import {ParticipantApprovalPage} from '../participant-approval/participant-approval.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';
import {RouteImageComponentModule} from '../route-image/route-image.module';
import {EventReviewPage} from '../event-review/event-review.page';
import { ParticipantsLinesComponent } from '../participants-lines/participants-lines.component';
import {RatingComponentModule} from '../rating/rating.module';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
      ToolbarComponentModule,
      RouteImageComponentModule,
      IonicModule,
      RatingComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventDetailPage, JoinEventPage, ParticipantApprovalPage, EventReviewPage, ParticipantsLinesComponent],
    entryComponents: [
        JoinEventPage,
      ParticipantApprovalPage,
      EventReviewPage
    ]
})
export class EventDetailPageModule {}
