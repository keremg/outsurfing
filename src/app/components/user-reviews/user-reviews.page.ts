import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.page.html',
  styleUrls: ['./user-reviews.page.scss'],
})
export class UserReviewsPage implements OnInit {
  private userId: string;
  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.userId = this.navParams.get('userId'); 
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
