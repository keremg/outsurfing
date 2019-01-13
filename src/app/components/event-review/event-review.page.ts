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
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.page.html',
  styleUrls: ['./event-review.page.scss'],
})
export class EventReviewPage implements OnInit {
    event: SurfEvent;
    route: SurfRoute;
    eventID: string;
    routeUrl: string;// "./assets/images/zavitan.jpg";
    event_rating: number;
    guideName: string;
    guideId: string;
    guide_rating: number;
    guide_picture: string;
    participants_rating: number [] = [];
    participants_comments: string[] = [];
    participants: SurfParticipant[];
    participants_names: string[] = []  ;
    participants_imgs: string[] = [];
    participants_ids: string[] = [] ;
    event_comment: string = '';
    guide_comment: string = '';
    user_list: SurfUser[] = [];
    guide: SurfUser;
    isRouteRevExist: boolean = false;
    isGuideRevExist: boolean = true;
    isParticipantRevExist: boolean[] = [];
    private currentUserID: string;
    private currentUser: SurfUser;
    imGuide: boolean = false;

  constructor(
      private userService: UserService,
      private eventService: EventService,
      private navParams: NavParams,
      private modalController: ModalController,
      private routeService: RouteService,

  ) {
      //this.routeUrl = "routes/GO8a4ElzDUIBY6kz6Njs/1546895478281_0";
  }

  async ngOnInit() {
      this.currentUser = await this.userService.getCurrentUserPromise();
      this.currentUserID = this.currentUser.id;
      this.eventID = this.navParams.get('eventId');
      //this.eventOrganizer = this.navParams.get('eventOrganizer');
      this.event = this.navParams.get('event');
      this.guide = this.navParams.get('organizer');
      if(this.eventID) {
          let routePromise = new Promise<SurfRoute>(res=> this.routeService.getRoute(this.event.routeId).subscribe(res));
          this.route = await routePromise;
          this.routeUrl = this.route.imagesUrls[0]+'_Medium';
          let participantsPromise = new Promise<SurfParticipant[]>(res => this.eventService.getParticipants(this.eventID).subscribe(res));
          this.participants = await participantsPromise;
          for(let participant of this.participants) {
              if(!participant.approved || participant.id === this.guide.id){//TODO Guy maybe fix it
                  continue;
              }
              let resPromise = new Promise<SurfUser>(u =>participant.user.subscribe(u));
              let res = await resPromise;
              if (res.id === this.currentUserID) {
                  continue;
              }
              this.user_list.push(res);
              this.participants_names.push(res.firstName +" "+res.lastName);
              this.participants_ids.push(res.id);
              this.participants_imgs.push('users/' + res.id + '/profilePic_Medium');
              this.isParticipantRevExist.push(false);
          }
          let allParticipantsRevExist= true;
          for(let index = 0;index<this.user_list.length;index++){
              let participant = this.user_list[index];
              let resPromise = new Promise<boolean>(res => this.userService.ReviewAlreadyExist(participant.id, this.currentUserID, this.eventID).subscribe(res)) ;
              this.isParticipantRevExist[index] =  await resPromise;
              if(!this.isParticipantRevExist[index]) {
                  allParticipantsRevExist = false;
              }
          }

          if(this.event.isGuidedEvent) {
              this.guideName = this.guide.firstName + " " + this.guide.lastName;
              this.guideId = this.guide.id;
              this.guide_picture = 'users/' + this.guide.id + '/profilePic_Medium'

              let resPromise = new Promise<boolean>( res=>this.userService.GuideReviewAlreadyExist(this.guideId,this.currentUserID,this.eventID).subscribe(res));
              this.isGuideRevExist = await resPromise;
              if(this.guideId === this.currentUserID){
                  this.imGuide = true;
              }
          }

          let resPromise = new Promise<boolean>(res=>this.routeService.ReviewAlreadyExist(this.event.routeId, this.currentUserID, this.eventID).subscribe(res));
          this.isRouteRevExist = await resPromise;
          if(this.isRouteRevExist && (this.isGuideRevExist || this.imGuide) && allParticipantsRevExist ){
              alert('Review already exist');
              this.modalController.dismiss();
          }
      }



  }
    build_review_for_user(index,time){
        let review = new SurfReview();
        review.reviewerId = this.currentUserID;
        review.forEventId = this.eventID;
        review.grade = this.participants_rating[index];
        review.review = this.participants_comments[index];
        if(review.review === undefined){
            review.review = '';
        }
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
    
    async onClose() {
        let time = (new Date()).getTime();
        let rev = this.build_review_for_event(time);
        if(rev.grade){
            await this.routeService.addReview(this.route, rev);
        }
        if (this.event.isGuidedEvent) {
            rev =  this.build_review_for_guide(time);
            if(rev.grade){
                await this.userService.addGuideReview(this.guide,rev)
            }
        }
        for (let i = 0; i < this.user_list.length; i++) {
            rev = this.build_review_for_user(i, time);
            if(rev.grade){
                await this.userService.addReview(this.user_list[i], rev )
            }
        }
        return this.modalController.dismiss();
    }
}
