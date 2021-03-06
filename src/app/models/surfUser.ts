import {SurfEvent} from './surfEvent';
import {SurfReview} from './surfReview';
import {Observable} from 'rxjs';

export class SurfUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    recentLocation?: string;
    about?: string;
    cancellations?: number;
    gender?: number; //0 is male, 1 is female, 2 is other
    isGuide?: boolean;
    phone?: string;
    birthDate?: string;
    tripDifficulties?: number[] = []; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    tripDurations?: number[] = []; //will represent number of days, so half day should be 0.5 , one hour should be 0.04
    audienceTypes?: number[] = [];


    avgRating?: number;
    numOfRaters?: number;

    avgGuideRating?: number;
    numOfGuideRaters?: number;

    numOfEventsParticipated?: number = 0;


}
