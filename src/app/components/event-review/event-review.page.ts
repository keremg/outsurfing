import {Component, OnInit} from '@angular/core';
import {AudienceTypeEnum} from '../../AudienceType.enum';
import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import { SurfEvent} from '../../models/surfEvent';
import {ModalController, NavParams} from '@ionic/angular';
import {Observable} from 'rxjs';
import {SurfParticipant} from '../../models/surfParticipant';
import {SurfUser} from '../../models/surfUser';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.page.html',
  styleUrls: ['./event-review.page.scss'],
})
export class EventReviewPage implements OnInit {
    event: SurfEvent;
    eventID: string;
    event_image = "./assets/images/zavitan.jpg";
    guide_image = "./assets/images/haham.jpg";
    event_review: number;
    isGuided: boolean;
    guideName: string;
    guide_review: number;
    participants_rating: {name:string, rating:number} [];
    participants :Observable<SurfParticipant[]>;
    participants_names: string[];
    participants_imgs: string[];
  constructor(
      private userService: UserService,
      private eventService: EventService,
      private navParams: NavParams,
      private modalController: ModalController,

  ) {
      this.isGuided =false;
      this.guideName = "madrichush";
      //this.participants = ['dani','avi'];
      this.participants_rating = [];
      this.participants_rating.push({name:'dani', rating: 0});
      this.participants_rating.push({name:'avi', rating: 0});
      this.participants_imgs = ["./assets/images/haham.jpg","./assets/images/haham.jpg"]
  }

  async ngOnInit() {
      this.eventID = this.navParams.get('eventId');
      //this.eventOrganizer = this.navParams.get('eventOrganizer');
      this.event = this.navParams.get('event');
      if(this.eventID) {
          this.participants = this.eventService.getParticipants(this.eventID);
          this.participants.subscribe(p=>{
              console.log(p);
          });

      }
  }

    onClose(){
        console.log( this.participants_rating['avi'])
    }
}
