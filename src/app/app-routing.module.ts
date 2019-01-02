import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'SignIn', pathMatch: 'full' },
  { path: 'home', loadChildren: './components/home/home.module#HomePageModule',canActivate: [AuthGuardService]},
    { path: 'home/:q', loadChildren: './components/home/home.module#HomePageModule',canActivate: [AuthGuardService]},
    { path: 'ChooseRoute', loadChildren: './components/ChooseRoute/ChooseRoute.module#ChooseRoutePageModule',canActivate: [AuthGuardService]},
  { path: 'SignIn', loadChildren: './components/SignIn/SignIn.module#SignInModule' },
  { path: 'ResetPassword', loadChildren: './components/reset-password/reset-password.module#ResetPasswordPageModule'},
  { path: 'SignUp', loadChildren: './components/signup/signup.module#SignupPageModule'},
  { path: 'SingleRoute', loadChildren: './components/single-route/single-route.module#SingleRoutePageModule',canActivate: [AuthGuardService]},

    { path: 'SingleRoute/:id', loadChildren: './components/single-route/single-route.module#SingleRoutePageModule',canActivate: [AuthGuardService]},
  { path: 'ViewProfile', loadChildren: './components/view-profile/view-profile.module#ViewProfilePageModule',canActivate: [AuthGuardService]},
  { path: 'EditProfile', loadChildren: './components/edit-profile/edit-profile.module#EditProfilePageModule' ,canActivate: [AuthGuardService] },
  { path: 'Admin', loadChildren: './components/admin/admin.module#AdminPageModule',canActivate: [AuthGuardService] },
  { path: 'EventReview', loadChildren: './components/event-review/event-review.module#EventReviewPageModule' ,canActivate: [AuthGuardService]},
    { path: 'EventDetail/:id/:route', loadChildren: './components/event-detail/event-detail.module#EventDetailPageModule' ,canActivate: [AuthGuardService]},

  { path: 'JoinEvent', loadChildren: './components/join-event/join-event.module#JoinEventPageModule' ,canActivate: [AuthGuardService]},
  { path: 'UserReviews', loadChildren: './components/user-reviews/user-reviews.module#UserReviewsPageModule' },
  { path: 'ParticipantApproval', loadChildren: './components/participant-approval/participant-approval.module#ParticipantApprovalPageModule' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
