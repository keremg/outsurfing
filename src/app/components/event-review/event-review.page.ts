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
    guideId: string;
    guide_review: number;
    participants_rating: {name:string, rating:number} [];
    participants: SurfParticipant[];
    participants_names: string[] = []  ;
    participants_imgs: string[];
    participants_ids: string[];
    private currentUserID: string;
    private currentUser: SurfUser;
  constructor(
      private userService: UserService,
      private eventService: EventService,
      private navParams: NavParams,
      private modalController: ModalController,

  ) {
      this.isGuided =false;
      this.guideName = "madrichush";
      //this.participants = ['dani','avi'];
      //this.participants_imgs = ["./assets/images/haham.jpg","./assets/images/haham.jpg"]
  }

  async ngOnInit() {
      this.currentUser = await this.userService.getCurrentUserPromise();
      this.currentUserID = this.currentUser.id;
      this.eventID = this.navParams.get('eventId');
      //this.eventOrganizer = this.navParams.get('eventOrganizer');
      this.event = this.navParams.get('event');
      if(this.eventID) {
          let participantsPromise = new Promise<SurfParticipant[]>(res => this.eventService.getParticipants(this.eventID).subscribe(res));
          this.participants = await participantsPromise;
          for(let participant of this.participants) {
              debugger;
              participant.user.subscribe(u=>{
                  if (u.id === this.currentUserID) {
                      return;
                  }
                  this.participants_names.push(u.firstName +" "+u.lastName);
                  this.participants_ids.push(u.id);
                  this.participants_imgs.push("./assets/images/haham.jpg");
              });

          }

      }
      this.isGuided = this.event.isGuidedEvent;
      if(this.isGuided){
          this.event.eventOrganizer.subscribe(x=>{
              this.guideName = x.firstName + " " + x.lastName;
              this.guideId = x.id;
          });
      }

  }

    onClose(){
        console.log( this.participants_rating['avi'])
    }
}
