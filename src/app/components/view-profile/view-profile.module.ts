import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewProfilePage } from './view-profile.page';
import {UserReviewsPage} from '../user-reviews/user-reviews.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';


const routes: Routes = [
  {
    path: '',
    component: ViewProfilePage
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
  declarations: [ViewProfilePage, UserReviewsPage],
  entryComponents: [
    UserReviewsPage
  ]
})
export class ViewProfilePageModule {}
