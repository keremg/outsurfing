import {SurfUser} from './surfUser';
import {Observable} from 'rxjs';

export class SurfParticipant {
    id?: string;
    user: Observable<SurfUser>; //will take firstName and lastName from there
    phone: string;
    email: string;
    registrationDate: string;
    isOrganizer: boolean;
    isGuide: boolean;
    offeringSeatsInCar: number;
    needSeatInCar: boolean;
    userIdOfHostingCar: string;
    isStandByForCar: boolean;
    isApproved: boolean;
    groupEquipmentIBring: string;
    approved: boolean;
}