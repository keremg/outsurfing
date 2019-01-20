import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {SurfRoute} from '../../models/surfRoute';
import {SurfParticipant} from '../../models/surfParticipant';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
import {SurfEvent} from '../../models/surfEvent';

declare let window: any;

@Component({
    selector: 'app-join-event',
    templateUrl: './join-event.page.html',
    styleUrls: ['./join-event.page.scss'],
})
export class JoinEventPage implements OnInit {
    private eventID: string;
    public joinEventForm: FormGroup;
    participant: SurfParticipant = new SurfParticipant();
    user: SurfUser;
    event: SurfEvent;
    isEditParticipant = false;

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private eventService: EventService,
                private formBuilder: FormBuilder,
                private userService: UserService) {


        this.joinEventForm = this.formBuilder.group({
            phone: ['', Validators.required],
            email: ['', Validators.required],
            equipment: [''],
            car: [false, Validators.required],
            places: [0, Validators.required],
            message: ['']
        });
        window.form = this.joinEventForm;
    }

    async ngOnInit() {
        this.eventID = this.navParams.get('eventId');
        this.event = this.navParams.get('event');
        let participantParam = this.navParams.get('participant');
        if (participantParam) {
            this.participant = participantParam;
            this.isEditParticipant = true;
        } else {
            this.participant = new SurfParticipant();
            this.isEditParticipant = false;
        }
        this.user = await this.userService.getCurrentUserPromise();

        let valueToPatchToForm;
        if (this.isEditParticipant) {
            valueToPatchToForm = {
                phone: this.participant.phone,
                email: this.participant.email,
                places: this.participant.offeringSeatsInCar | 0,
                car: !this.participant.needSeatInCar,
                equipment: this.participant.groupEquipmentIBring,
                message: this.participant.messageToOthers,

            };
        } else {
            valueToPatchToForm = {
                phone: this.user.phone,
                email: this.user.email
            };
        }
        //Update the form with data:
        this.joinEventForm.patchValue(valueToPatchToForm);
    }

    //This function is ALSO for UPDATING PARTICIPANT if this.isEditParticipant
    async joinAndCloseModal() {
        if (!this.joinEventForm.valid) {
            alert('form is not valid');
            return;
        }
        this.mapFormValuesToParticipantModel();
        this.participant.isOrganizer = (this.event.eventOrganizerId === this.user.id);
        this.participant.isGuide = this.participant.isOrganizer && this.event.isGuidedEvent;
        // Set sort-ranking for the participant
        this.participant.sortRanking = 2;//default
        // For participants we give better baseline of score 3, as we don't want low rank when more people join
        if (this.user.avgRating && this.user.numOfRaters > 0) {
            this.participant.sortRanking = (3*3 + this.user.numOfRaters * this.user.avgRating) / (3 + this.user.numOfRaters);
        } else if (this.user.avgGuideRating && this.user.numOfGuideRaters > 0) {
            this.participant.sortRanking = (3*3 + this.user.numOfGuideRaters * this.user.avgGuideRating) / (3 + this.user.numOfGuideRaters);
        }

        //this.participant.approved  //better to do separate when we also updating the event counters of seats

        if (this.isEditParticipant) {
            return this.eventService.editParticipantOfEvent(this.eventID, this.participant, this.event).then(() => {
                return this.modalController.dismiss(this.participant);
            });
        } else {
            return this.eventService.joinEvent(this.eventID, this.participant, this.event).then(() => {
                return this.modalController.dismiss(this.participant);
            });
        }
    }

    mapFormValuesToParticipantModel() {
        this.participant.id = this.user.id;
        this.participant.phone = this.joinEventForm.value.phone;
        this.participant.email = this.joinEventForm.value.email;
        this.participant.groupEquipmentIBring = this.joinEventForm.value.equipment;
        this.participant.registrationDate = this.participant.registrationDate || new Date().getTime();
        if (this.joinEventForm.value.car) {
            this.participant.needSeatInCar = false;
            this.participant.offeringSeatsInCar = this.joinEventForm.value.places;
            //this.participant.availableSeatsInCar = this.joinEventForm.value.places;
        } else {
            this.participant.needSeatInCar = true;
            this.participant.offeringSeatsInCar = 0;
            //this.participantsObs.isStandByForCar = true;

        }
        this.participant.approved = this.participant.approved || false;
        this.participant.messageToOthers = this.joinEventForm.value.message;

    }
}
