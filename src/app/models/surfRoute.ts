import {SurfUser} from './surfUser';

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
    mapUrl: string;
    lengthKM: number;
    shortDescription: string;
    longDescription: string; // details
    //routeRanking: {ranking: number, review: string}[];
    routeDifficulty: string; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    routeDuration: number; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
    routeProperties: string[]; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

    routeCreatorId: string;
    routeCreator?: SurfUser;
    isGuidingOffered: boolean;
    offeredPrice: number; // default 0, more if isGuidingOffered
    guideContactDetails: string; // ree text allowing the guide to describe email and/or phone for contacting him/her about guidance
    entranceFee: number;
    requiredEquipment: string;
    numEventsCreatedFromRoute: number;
    recommendedMonths: string[];

    iconName:string; //TODO terrain
    seasons:string;//TODO


}
