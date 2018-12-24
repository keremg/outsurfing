import {SurfUser} from './surfUser';

export class SurfEvent {
    id?: string;
    routeId: string; //the route from which the Event was created
    name: string;
    country: string;
    state: string;
    meetingLocation: string;//car pool meeting place(s)
    meetingTime: string; //full date&houre
    returnTime: string; //full date&houre  (duration of event is returnTime-meetingTime)
    routeStartTime: string; //full date&houre  (could be useful for people who comes from other places, can be the 2nd gathering time)
    routeStartLocation: string;
    routeEndLocation: string;
    imagesUrls: string[];
    mapUrl: string;
    lengthKM: number;
    shortDescription: string;
    longDescription: string; //details
    routeRanking: {ranking: number, review: string}[];
    routeDifficulty: number; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    routeDuration: number;//will represent number of days, so half day should be 0.5 , one hour should be 0.04
    routeProperties: string[]; //-	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

    routeCreatorId: string;
    routeCreator: SurfUser;
    eventOrgnizerId: string;
    eventOrgnizer: SurfUser; //will also show organizer's ranking
    audienceType: string[]; //singles, couples, with kids, LGBT, elderlies, youngs, women only, men only, etc
    isGuidedevent: boolean;
    priceOfEvent: number;    //default 0, more if isGuidedevent
    organizerContactDetails: string; //free text allowing the guide to describe email and/or phone for contacting him/her about event
    enteranceFee: number; //if any
    requiredEquipment: string;
    numEventsCreatedFromRoute: number;
    recommendedMonths: number[];
    isEventRequiresCars: boolean; //not all events requires cars handling
    participants: {user: SurfUser, registrationDate: string, isOrganizer: boolean, isGuide: boolean, offeringSeatsInCar: number, needSeatInCar: boolean, userIdOfHostingCar: number, isStandByForCar: boolean, isApproved: boolean, groupEquipmentIBring: string};


}
