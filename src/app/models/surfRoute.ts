import {SurfUser} from './surfUser';
import {Observable} from 'rxjs';
import {SurfReview} from './surfReview';

export class SurfRoute {
    id: string;
    name: string;
    country: string;
    state: string;
    routeStartLocation: string;
    routeEndLocation: string;
    routeStartGeolocation: string;
    routeEndGeolocation: string;
    imagesUrls: string[];
    mapImagesUrl: string[];
    lengthKM: number;
    shortDescription: string;
    longDescription: string; // details

    routeDifficulty: number; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    routeDuration: number; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
    routeProperties: string[]; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

  routeCreatorId: string;
  routeCreator?: Observable<SurfUser>;
  isGuidingOffered: boolean;
  offeredPrice: number; // default 0, more if isGuidingOffered
  minGroupSizeForGuide: number; //TODO - add to html
  guideContactDetails: string; // ree text allowing the guide to describe email and/or phone for contacting him/her about guidance
  entranceFee: number;
  requiredEquipment: string;
  numEventsCreatedFromRoute: number;
  recommendedMonths: string[];

  reviews: SurfReview[];
    //this should be handled in a separated collection: routeRanking: {reviewerId: string, ranking: number, review: string}[];
    routeRanking: number;
    routeNumOfRankers: number;

  iconName: string; //TODO terrain
  seasons: string; //TODO
}
