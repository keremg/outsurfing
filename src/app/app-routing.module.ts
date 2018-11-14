import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'SignIn', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'ChooseRoute', loadChildren: './ChooseRoute/ChooseRoute.module#ChooseRoutePageModule' },
  { path: 'SignIn', loadChildren: './SignIn/SignIn.module#SignInModule' },
  { path: 'EditTrip', loadChildren: './edit-trip/edit-trip.module#EditTripPageModule' },
  { path: 'ResetPassword', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'Signup', loadChildren: './signup/signup.module#SignupPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
