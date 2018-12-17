export class User {
    firstName: string;
    lastName: string;
    email: string;
    imagesUrls: string[];
    recentLocation: string;
    about: string;
    cancellations: number;
    gender: number; //0 is male, 1 is female, 2 is other
    isGuide: boolean;
    phone: string;
    birthDate: string;
    tripDifficulties: number[]; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    tripDurations: number[]; //will represent number of days, so half day should be 0.5 , one hour should be 0.04
    audienceTypes: string[];
    travelerRatings: {ranking: number, review: string}[];//can be changed to
    guideRatings: {ranking: number, review: string}[];
}
