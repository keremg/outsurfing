import {Component, OnInit} from '@angular/core';
import {AudienceTypeEnum} from '../../AudienceType.enum';
import {UserService} from '../../services/user.service';
import {EventService} from '../../services/event.service';
import { SurfEvent} from '../../models/surfEvent';
import {ModalController, NavParams} from '@ionic/angular';
import {Observable} from 'rxjs';
import {SurfParticipant} from '../../models/surfParticipant';
import {SurfUser} from '../../models/surfUser';
import {SurfReview} from '../../models/surfReview';
import {RouteService} from '../../services/route.service';
import {SurfRoute} from '../../models/surfRoute';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.page.html',
  styleUrls: ['./event-review.page.scss'],
})
export class EventReviewPage implements OnInit {
    event: SurfEvent;
    route: SurfRoute;
    eventID: string;
    event_image = "./assets/images/zavitan.jpg";
    guide_image = "./assets/images/haham.jpg";
    event_rating: number;
    isGuided: boolean;
    guideName: string;
    guideId: string;
    guide_rating: number;
    participants_rating: number [] = [];
    participants_comments: string[] = [];
    participants: SurfParticipant[];
    participants_names: string[] = []  ;
    participants_imgs: string[] = [];
    participants_ids: string[] = [] ;
    event_comment: string;
    guide_comment: string;
    user_list: SurfUser[] = [];
    guide: SurfUser;
    private currentUserID: string;
    private currentUser: SurfUser;

  constructor(
      private userService: UserService,
      private eventService: EventService,
      private navParams: NavParams,
      private modalController: ModalController,
      private routeService: RouteService,

  ) {
      //this.isGuided =false;
      //this.guideName = "madrichush";
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
          let routePromise = new Promise<SurfRoute>(res=> this.routeService.getRoute(this.event.routeId).subscribe(res));
          this.route = await routePromise;

          let participantsPromise = new Promise<SurfParticipant[]>(res => this.eventService.getParticipants(this.eventID).subscribe(res));
          this.participants = await participantsPromise;
          for(let participant of this.participants) {
              debugger;
              participant.user.subscribe(u=>{
                  if (u.id === this.currentUserID) {
                      return;
                  }
                  this.user_list.push(u);
                  this.participants_names.push(u.firstName +" "+u.lastName);
                  this.participants_ids.push(u.id);
                  this.participants_imgs.push("./assets/images/haham.jpg");
              });

          }

      }
      this.isGuided = this.event.isGuidedEvent;
      if(this.isGuided){
          this.event.eventOrganizer.subscribe(x=>{
              this.guide = x;
              this.guideName = x.firstName + " " + x.lastName;
              this.guideId = x.id;
              
          });
      }

  }
    build_review_for_user(index,time){
        let review = new SurfReview();
        review.reviewerId = this.currentUserID;
        review.forEventId = this.eventID;
        review.grade = this.participants_rating[index];
        review.review = this.participants_comments[index];
        review.reviewTime = time;
        return review;
    }

    build_review_for_guide(time){
        let review = new SurfReview();
        review.reviewerId = this.currentUserID;
        review.forEventId = this.eventID;
        review.grade = this.guide_rating;
        review.review = this.guide_comment;
        review.reviewTime = time;
        return review;
    }

    build_review_for_event(time){
        let review = new SurfReview();
        review.reviewerId = this.currentUserID;
        review.forEventId = this.eventID;
        review.grade = this.event_rating;
        review.review = this.event_comment;
        review.reviewTime = time;
        return review;
    }
    
    async onClose(){
      let time = (new Date()).getTime();
      //await this.routeService.addReview(this.route,this.build_review_for_event(time));
      if(this.isGuided){
          await this.userService.addGuideReview(this.guide,this.build_review_for_guide(time))
      }
      for(let i=0;i< this.user_list.length;i++ ){
          await this.userService.addReview(this.user_list[i],this.build_review_for_user(i,time))
      }
      console.log( this.participants_rating[0])
    }
}
