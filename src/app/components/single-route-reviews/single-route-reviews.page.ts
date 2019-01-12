import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { RouteService } from '../../services/route.service';
import { SurfReview } from '../../models/surfReview';
import { SurfRoute } from '../../models/surfRoute';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-single-route-reviews',
  templateUrl: './single-route-reviews.page.html',
  styleUrls: ['./single-route-reviews.page.scss']
})
export class SingleRouteReviewsPage implements OnInit {
  routeId: string;
  reviews: Observable<SurfReview[]>;
  route: SurfRoute;

  constructor(
    private navParams: NavParams,
    private routeService: RouteService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.routeId = this.navParams.data.routeId;

    this.routeService.getRoute(this.routeId).subscribe(res => {
      this.route = res;
    });
    //console.log('im route id', this.route.imagesUrls[0]);
    this.reviews = this.routeService.getRouteReviews(this.routeId);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
