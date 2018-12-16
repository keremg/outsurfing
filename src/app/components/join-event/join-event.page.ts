import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.page.html',
  styleUrls: ['./join-event.page.scss'],
})
export class JoinEventPage implements OnInit {
    private eventID: string;

  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
      this.eventID = this.navParams.get('eventId');
  }

    closeModal() {
        this.modalController.dismiss();
    }
}
