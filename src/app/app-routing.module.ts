import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'SignIn', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'ChooseTrip', loadChildren: './ChooseTrip/ChooseTrip.module#ChooseTripPageModule' },
  { path: 'SignIn', loadChildren: './SignIn/SignIn.module#SignInModule' },
  { path: 'EditEvent', loadChildren: './edit-event/edit-event.module#EditEventPageModule' },
  { path: 'ResetPassword', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'Signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'CreateTrip', loadChildren: './create-trip/create-trip.module#CreateTripPageModule' },
  { path: 'ViewProfile', loadChildren: './view-profile/view-profile.module#ViewProfilePageModule' },
  { path: 'EditProfile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'Admin', loadChildren: './admin/admin.module#AdminPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
