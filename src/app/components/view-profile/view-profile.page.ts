import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SurfUser } from '../../models/surfUser';
import { UserReviewsPage } from '../user-reviews/user-reviews.page';
import { ModalController, NavController } from '@ionic/angular';
import { PaginationService } from '../../services/pagination.service';
import { AudienceTypeEnum } from '../../AudienceType.enum';
import { DurationEnum } from '../../enums/Duration.enum';
import { DifficultiesEnum } from '../../enums/Difficulties.enum';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';

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
  gender_string: string;
  isGuide: boolean;
  phone: string;
  birthDate: string;
  tripDifficulties: string; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
  tripDurations: string; //will represent number of days, so half day should be 0.5 , one hour should be 0.04
  audienceTypes: string;

  avgRating: number;
  numOfRaters: number;
  profileUrl: string;
  user: SurfUser;
  guideButton: boolean = false;

  constructor(
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private storage: AngularFireStorage
  ) {}

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('uid');
    this.userService.getuser(this.id).subscribe(u => {
      if (u) {
        this.user = u;
        this.email = this.user.email;
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
        if (this.user.gender === 0) {
          this.gender_string = 'Male';
        }
        if (this.user.gender === 1) {
          this.gender_string = 'Female';
        }
        if (this.user.gender === 2) {
          this.gender_string = 'Other';
        }
        this.birthDate = this.user.birthDate;
        this.phone = this.user.phone;
        this.isGuide = this.user.isGuide || false;
        this.about = this.user.about;

        this.audienceTypes = '';
        for (let dif in this.user.audienceTypes) {
          if (dif !== '0') this.audienceTypes = this.audienceTypes + ',';

          this.audienceTypes =
            this.audienceTypes + AudienceTypeEnum[this.user.audienceTypes[dif]];
        }

        this.tripDurations = '';
        for (let dif in this.user.tripDurations) {
          if (dif !== '0') this.tripDurations = this.tripDurations + ',';

          this.tripDurations =
            this.tripDurations + DurationEnum[this.user.tripDurations[dif]];
        }

        this.tripDifficulties = '';
        for (let dif in this.user.tripDifficulties) {
          if (dif !== '0') this.tripDifficulties = this.tripDifficulties + ',';

          this.tripDifficulties =
            this.tripDifficulties +
            DifficultiesEnum[this.user.tripDifficulties[dif]];
        }
        this.avgRating = this.user.avgRating;
        this.numOfRaters = this.user.numOfRaters;
      }
    });

    const ref = this.storage.ref('users/' + this.id + '/profilePic_Large');
    ref
      .getDownloadURL()
      .toPromise()
      .then(
        res => {
          this.profileUrl = res;
        },
        async error => {
          console.log(error);
        }
      );
  }

  async onShow() {
    this.guideButton = false;
    const modal = await this.modalController.create({
      component: UserReviewsPage,
      componentProps: { userId: this.id, button: this.guideButton }
    });
    return await modal.present();
  }

  async onShowGuide() {
    this.guideButton = true;
    const modal = await this.modalController.create({
      component: UserReviewsPage,
      componentProps: { userId: this.id, button: this.guideButton }
    });
    return await modal.present();
  }
}
