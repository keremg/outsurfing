import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParticipantApprovalPage } from './participant-approval.page';
import {ParticipantsLinesComponent} from '../participants-lines/participants-lines.component';

const routes: Routes = [
  {
    path: '',
    component: ParticipantApprovalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ParticipantApprovalPage, ParticipantsLinesComponent]
})
export class ParticipantApprovalPageModule {}
