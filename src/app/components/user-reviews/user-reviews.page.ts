import { Component, NgModule, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { SurfUser } from '../../models/surfUser';
import { UserService } from '../../services/user.service';
import { RouterModule, Routes } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import { SurfReview } from '../../models/surfReview';
import { Observable } from 'rxjs';
import { Colors } from '../../colors.enum';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.page.html',
  styleUrls: ['./user-reviews.page.scss'],
  providers: [PaginationService]
})
export class UserReviewsPage implements OnInit {
  private userId: string;
  private user: SurfUser;
  private name: string;
  public page: PaginationService;
  private review: string;
  private grade: number;
  private totalTrips: number;
  private reviews: Observable<SurfReview[]>;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.navParams.data.userId;
    this.userService.getuser(this.userId).subscribe(u => {
      if (u) {
        this.user = u;
      }
    });
    this.reviews = this.userService.getUserReviews(this.userId);
    console.log(this.reviews, 'im reviews');

    //this.name = this.user.firstName + this.user.lastName;
    //this.page.init('review', this.userId, {reverse: true, prepend: false}, this.userId);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  loadData(review) {
    this.page.more();

    console.log('Done');
    review.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    //if (this.page.done) {
    //event.target.disabled = true;
    //}
  }
}
