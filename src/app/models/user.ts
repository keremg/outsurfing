export interface User {
    firstName: string;
    lastName: string;
    userName: string;
    about:string,
    email: string;
    cancellations: number;
    gender: number; //0 is male, 1 is female, 2 is other
    isGuide: boolean;
    phone: string;

    //birthDate:date,
    //tripLevel:[""],
    //tripDuration:[""],
    //peopleType:[""],
}
