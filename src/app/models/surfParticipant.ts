import {SurfUser} from './surfUser';
import {Observable} from 'rxjs';

export class SurfParticipant {
    id?: string; //UserID
    user: Observable<SurfUser>; //will take firstName and lastName from there
    phone: string;
    email: string;
    registrationDate: number;
    isOrganizer: boolean;
    isGuide: boolean;
    groupEquipmentIBring: string;

    offeringSeatsInCar: number;
    //availableSeatsInCar:number;

    needSeatInCar: boolean;
    //userIdOfHostingCar: string;
    //isStandByForCar: boolean;
    //TODO allow cars just for private cars events

    messageToOthers: string;
    approved: boolean;
}