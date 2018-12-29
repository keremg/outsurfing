import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventDetailPage } from './event-detail.page';
import {JoinEventPage} from '../join-event/join-event.page';

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

      IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventDetailPage, JoinEventPage],
    entryComponents: [
        JoinEventPage
    ]
})
export class EventDetailPageModule {}
