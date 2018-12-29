import {SurfUser} from './surfUser';

export class SurfParticipant {
    id?: string;
    userId: string;
    user: SurfUser; //will take firstName abd familyName from there
    phone: string;
    email: string;
    registrationDate: string;
    isOrganizer: boolean;
    isGuide: boolean;
    offeringSeatsInCar: number;
    needSeatInCar: boolean;
    userIdOfHostingCar: number;
    isStandByForCar: boolean;
    isApproved: boolean;
    groupEquipmentIBring: string;

}