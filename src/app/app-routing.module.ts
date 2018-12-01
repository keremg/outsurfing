import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'SignIn', pathMatch: 'full' },
  { path: 'home', loadChildren: './components/home/home.module#HomePageModule'},
  { path: 'ChooseRoute', loadChildren: './components/ChooseRoute/ChooseRoute.module#ChooseRoutePageModule'},
  { path: 'SignIn', loadChildren: './components/SignIn/SignIn.module#SignInModule' },
  { path: 'EditEvent', loadChildren: './components/edit-event/edit-event.module#EditEventPageModule'},
  { path: 'ResetPassword', loadChildren: './components/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'Signup', loadChildren: './components/signup/signup.module#SignupPageModule' },
  { path: 'CreateTrip', loadChildren: './components/create-trip/create-trip.module#CreateTripPageModule'},
  { path: 'ViewProfile', loadChildren: './components/view-profile/view-profile.module#ViewProfilePageModule'},
  { path: 'EditProfile', loadChildren: './components/edit-profile/edit-profile.module#EditProfilePageModule'  },
  { path: 'Admin', loadChildren: './components/admin/admin.module#AdminPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
