import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditProfilePage } from './edit-profile.page';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
      ToolbarComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
