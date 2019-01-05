import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs';
import {SurfParticipant} from '../../models/surfParticipant';
import {SurfEvent} from '../../models/surfEvent';

@Component({
  selector: 'app-participant-approval',
  templateUrl: './participant-approval.page.html',
  styleUrls: ['./participant-approval.page.scss'],
})
export class ParticipantApprovalPage implements OnInit {
    private eventID: string;
    eventOrganizer: string;
    event: SurfEvent;
    participants: Observable<SurfParticipant[]>;

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private eventService: EventService,) {
    }

    ngOnInit() {
        this.eventID = this.navParams.get('eventId');
        this.eventOrganizer = this.navParams.get('eventOrganizer');
        this.event = this.navParams.get('event');
        if(this.eventID) {
            this.participants = this.eventService.getParticipants(this.eventID);
            this.participants.subscribe(p=>{
                console.log(p);
            })
        }
    }

    async onApprove(uid:string){
      return this.eventService.approveParticipant(this.eventID,uid, this.event)
    }
    async onDisapprove(uid:string){
        return this.eventService.disapproveParticipant(this.eventID,uid, this.event)
    }

    async onClose() {
       return this.modalController.dismiss();
    }

}
