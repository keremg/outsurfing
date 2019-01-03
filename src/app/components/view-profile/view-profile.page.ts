import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
import {UserReviewsPage} from '../user-reviews/user-reviews.page';
import {ModalController, NavController} from '@ionic/angular';
import {PaginationService} from '../../services/pagination.service';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
  providers: [PaginationService]
})
export class ViewProfilePage implements OnInit {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  about: string;
  cancellations: number;
  gender_string: string;
  isGuide: boolean;
  phone: string;
  birthDate: string;
  tripDifficulties: number[]; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
  tripDurations: number[]; //will represent number of days, so half day should be 0.5 , one hour should be 0.04
  audienceTypes: number[];
  travelerRatings: {ranking: number, review: string}[];//can be changed to
  guideRatings: {ranking: number, review: string}[];
  avgRating: number;
  numOfRaters: number;
  constructor(
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = 'PY2FTM1P7uZbtOiDDZPYGp7GQqn1';
   let user;
    this.userService.getuser(this.id).subscribe(u => {
      if (u) {
        user = u;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        if (user.gender === 0) {
          this.gender_string = 'Male';
        }
        if (user.gender === 1) {
          this.gender_string = 'Female';
        }
        if (user.gender === 2) {
          this.gender_string = 'Other';
        }
        this.birthDate = user.birthDate;
        this.phone = user.phone;
        this.isGuide = user.isGuide;
        this.about = user.about;
        this.tripDifficulties = user.tripDifficulties;
        this.tripDurations =  user.tripDurations;
        this.audienceTypes = user.audienceTypes;
        this.avgRating = user.avgRating;
        this.numOfRaters = user.numOfRaters;
      }
    });
  }

  async onShow() {
    const modal = await this.modalController.create({
        component: UserReviewsPage,
        componentProps: { userId: this.id }
    });
    return await modal.present();
}

}
