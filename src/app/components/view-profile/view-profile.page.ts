import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  about: string;
  cancellations: number;
  gender: number; //0 is male, 1 is female, 2 is other
  isGuide: boolean;
  phone: string;
  birthDate: string;
  tripDifficulties: number[]; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
  tripDurations: number[]; //will represent number of days, so half day should be 0.5 , one hour should be 0.04
  audienceTypes: number[];
  travelerRatings: {ranking: number, review: string}[];//can be changed to
  guideRatings: {ranking: number, review: string}[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
    
    this.email = "nir";
  }
    
  
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    let user = this.userService.getuser(this.id);
  }

}
