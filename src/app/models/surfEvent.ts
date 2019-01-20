import {SurfUser} from './surfUser';
import {SurfRoute} from './surfRoute';
import {SurfParticipant} from './surfParticipant';
import {Observable} from 'rxjs';

export class SurfEvent extends SurfRoute {

    constructor(surfRoute?: SurfRoute) {
        super();
        if (surfRoute) {
            Object.keys(surfRoute).forEach(key => {if (key !== 'id') { this[key] = surfRoute[key]; }}  );
            this.routeId = surfRoute.id;
            this.meetingLocation = surfRoute.routeStartLocation; // as default
            this.meetingGeolocation = surfRoute.routeStartGeolocation; // as default

            this.eventSortRanking = 6; //default rank of 2 for route + organizer + participants
            if (surfRoute.routeNumOfRankers > 0) {
                this.eventSortRanking -= 2;
                let add = (3*2 + surfRoute.routeNumOfRankers * surfRoute.routeRanking) / (3 + surfRoute.routeNumOfRankers);
                this.eventSortRanking += add;
            }
        }
    }


    // id: string;
    // name: string;
    // country: string;
    // state: string;
    // routeStartLocation: string;
    // routeEndLocation: string;
    // routeStartGeolocation: string;
    // routeEndGeolocation: string;
    // imagesUrls: string[];
    // mapImagesUrl: string[];
    // lengthKM: number;
    // shortDescription: string;
    // longDescription: string; //details
    // // this should be handled in a separated collection: routeRanking: {reviewerId: string, ranking: number, review: string}[];
    // routeRanking: number;
    // routeNumOfRankers: number;
    // routeDifficulty: string; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    // routeDuration: number; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
    // routeProperties: string[]; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes
    //
    // routeCreatorId: string;
    // routeCreator?: SurfUser;
    // isGuidingOffered: boolean;
    // minGroupSizeForGuide: number;
    // offeredPrice: number; // default 0, more if isGuidingOffered
    // guideContactDetails: string; // ree text allowing the guide to describe email and/or phone for contacting him/her about guidance
    // entranceFee: number;
    // requiredEquipment: string;
    // numEventsCreatedFromRoute: number;
    // recommendedMonths: string[];
    //
    // iconName: string; //TODO terrain
    // seasons: string;//TODO

    //TODO verify that upone event-create, the organizer is set into eventOrganizerId
    //TODO verify that if I'm noy eventOrganizedId then I'm in VIEW_MODE
    //Show date/time choice option (if not view-mode)
    routeId: string; //@@ the route from which the Event was created
    meetingLocation: string;//@@car pool meeting place(s)
    meetingGeolocation: string;//@@car pool meeting place(s)
    meetingTime: string; //@@full date&houre
    routeStartTime: string; //@@full date&houre  (could be useful for people who comes from other places, can be the 2nd gathering time)
    returnTime: string; //@@full date&houre  (duration of event is returnTime-meetingTime)

    eventOrganizerId: string;
    eventOrganizer: Observable<SurfUser>; //will also show organizer's ranking
    eventOrganizerReal: SurfUser;
    audienceType: string[]; //singles, couples, with kids, LGBT, elderlies, youngs, women only, men only, etc
    isGuidedEvent: boolean;
    priceOfEvent: number;    //default 0, more if isGuidedEvent
    organizerContactDetails: string; //free text allowing the guide to describe email and/or phone for contacting him/her about event
    requiredEquipment: string;
    isEventRequiresCars: boolean; //not all events requires cars handling

    availableSeats: number;//TODO should add in approve
    participantsObs: Observable<SurfParticipant[]>;
    participants: SurfParticipant[];
    approvedParticipants: number;

    searchIndex: any[];
    isPastEvent:boolean;
    eventSortRanking = 6;

}
