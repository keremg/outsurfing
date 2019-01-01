import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParticipantApprovalPage } from './participant-approval.page';

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
  declarations: [ParticipantApprovalPage]
})
export class ParticipantApprovalPageModule {}
