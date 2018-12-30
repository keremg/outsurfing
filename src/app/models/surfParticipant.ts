import {SurfUser} from './surfUser';

export class SurfParticipant {
    id?: string;
    userId: string;
    user: SurfUser; //will take firstName and lastName from there
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

}