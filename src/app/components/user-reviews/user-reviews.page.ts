import {Component, NgModule, OnInit} from '@angular/core';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {SurfUser} from '../../models/surfUser';
import {UserService} from '../../services/user.service';
import {RouterModule, Routes} from '@angular/router';
import {PaginationService} from '../../services/pagination.service';



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
  constructor(private navParams: NavParams, private modalController: ModalController, private userService: UserService) {
    this.userId = 'PY2FTM1P7uZbtOiDDZPYGp7GQqn1';
  }

  ngOnInit() {
      //this.userId = this.navParams.get('UserId');
      console.log(this.userId);
      this.userService.getuser(this.userId).subscribe(u => {
          if (u) {
              this.user = u;
          }
      });
      //this.name = this.user.firstName + this.user.lastName;
      //this.page.init('review', this.userId, {reverse: true, prepend: false}, this.userId);


      this.name = "nir sivan";
      this.review = "it was very fun trip with him";
      this.grade = 4.5;
      this.totalTrips = 4;
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
