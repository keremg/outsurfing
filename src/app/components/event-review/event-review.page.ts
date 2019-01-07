import {Component, OnInit} from '@angular/core';
import {AudienceTypeEnum} from '../../AudienceType.enum';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.page.html',
  styleUrls: ['./event-review.page.scss'],
})
export class EventReviewPage implements OnInit {
    audiences : AudienceTypeEnum[];
    audiences_strings : string[];
    audience_rating : {type:string,rating:Number} [];
    event_reviews: number[];
    isGuided: boolean;
    guideName: string;
    guide_reviews: number[];
    participants_rating: {name:string, rating:number} [];
    participants : string[];
  constructor() {
      this.event_reviews = [0,0];
      this.audiences = [AudienceTypeEnum.Elderlies,AudienceTypeEnum.Couples];
      this.audiences_strings = ['Elderlies','Couples'];
      this.audience_rating = [];
      this.audience_rating.push({type: 'Elderlies', rating: 0});
      this.audience_rating.push({type: 'Couples', rating: 0});
      this.isGuided =true;
      this.guideName = "madrichush";
      this.guide_reviews = [0,0];
      this.participants = ['dani','avi'];
      this.participants_rating = [];
      this.participants_rating.push({name:'dani', rating: 0});
      this.participants_rating.push({name:'avi', rating: 0});

  }

  ngOnInit() {
  }

    submit(){
        console.log( this.participants_rating['avi'])
    }
}
