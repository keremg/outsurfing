import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { RouteService } from '../../services/route.service';
import { SurfReview } from '../../models/surfReview';
import { SurfRoute } from '../../models/surfRoute';
import { Observable } from 'rxjs';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
@Component({
  selector: 'app-single-route-reviews',
  templateUrl: './single-route-reviews.page.html',
  styleUrls: ['./single-route-reviews.page.scss']
})
export class SingleRouteReviewsPage implements OnInit {
  routeId: string;
  reviews: SurfReview[];
  route: SurfRoute;

  constructor(
    private navParams: NavParams,
    private routeService: RouteService,
    private modalController: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routeId = this.navParams.data.routeId;

    this.routeService.getRoute(this.routeId).subscribe(res => {
      this.route = res;
    });
    //console.log('im route id', this.route.imagesUrls[0]);
    let revObs = this.routeService.getRouteReviews(this.routeId);
      revObs.subscribe(async revArr=>{
        let rev:any;
      for( rev of revArr){
          let routePromise = new Promise<SurfUser>(us=> this.userService.getuser(rev.reviewerId).subscribe(us));
          rev.reviewer = await routePromise;
      }
        this.reviews =revArr;
    })
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
