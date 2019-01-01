import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs';
import {SurfParticipant} from '../../models/surfParticipant';

@Component({
  selector: 'app-participant-approval',
  templateUrl: './participant-approval.page.html',
  styleUrls: ['./participant-approval.page.scss'],
})
export class ParticipantApprovalPage implements OnInit {
    private eventID: string;
    participants: Observable<SurfParticipant[]>;

    constructor(private navParams: NavParams,
                private modalController: ModalController,
                private eventService: EventService,) {
    }

    ngOnInit() {
        this.eventID = this.navParams.get('eventId');
        if(this.eventID) {
            this.participants = this.eventService.getParticipants(this.eventID);
        }
    }

    async onApprove(uid:string){
      return this.eventService.approveParticipant(this.eventID,uid)
    }
    async onDisapprove(uid:string){
        return this.eventService.disapproveParticipant(this.eventID,uid)
    }

    async onClose() {
       return this.modalController.dismiss();
    }

}
