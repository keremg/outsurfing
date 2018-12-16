import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {JoinEventPage} from '../join-event/join-event.page';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  id: string;
  constructor(private modalController:ModalController,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService) { }

  ngOnInit() {
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      const eventObs = this.eventService.gettrip(this.id);
  }

  async onJoin(){
      const modal = await this.modalController.create({
          component: JoinEventPage,
          componentProps: { eventId: this.id }
      });
      return await modal.present();
  }

}
