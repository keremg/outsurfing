import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'SignIn', pathMatch: 'full' },
  { path: 'home', loadChildren: './components/home/home.module#HomePageModule' ,canActivate: [AuthGuardService]},
  { path: 'ChooseTrip', loadChildren: './components/ChooseTrip/ChooseTrip.module#ChooseTripPageModule'  ,canActivate: [AuthGuardService]},
  { path: 'SignIn', loadChildren: './components/SignIn/SignIn.module#SignInModule' },
  { path: 'EditEvent', loadChildren: './components/edit-event/edit-event.module#EditEventPageModule'  ,canActivate: [AuthGuardService]},
  { path: 'ResetPassword', loadChildren: './components/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'Signup', loadChildren: './components/signup/signup.module#SignupPageModule' },
  { path: 'CreateTrip', loadChildren: './components/create-trip/create-trip.module#CreateTripPageModule'  ,canActivate: [AuthGuardService]},
  { path: 'ViewProfile', loadChildren: './components/view-profile/view-profile.module#ViewProfilePageModule'  ,canActivate: [AuthGuardService]},
  { path: 'EditProfile', loadChildren: './components/edit-profile/edit-profile.module#EditProfilePageModule'  ,canActivate: [AuthGuardService]},
  { path: 'Admin', loadChildren: './components/admin/admin.module#AdminPageModule'  ,canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
