import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../services/user.service';
import {SurfParticipant} from '../../models/surfParticipant';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'participants-lines',
  templateUrl: './participants-lines.component.html',
  styleUrls: ['./participants-lines.component.scss']
})
export class ParticipantsLinesComponent implements OnInit {

  constructor(private userService: UserService,
              private eventService: EventService) { }

  //@Input() participant;
  @Input() eventObs;
  @Input() isApprovedLines;
  @Input() isOrganizerMode = false;
  @Input() event;
  @Input() eventID;
  @Input() currentUserId; //The current logged-in user
  @Input() isPastEvent: boolean = true;
  @Output() updated: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  async onApprove(participant:SurfParticipant){
    let res = await this.eventService.approveParticipant(this.eventID, participant, this.event);
    this.updated.emit(true);
  }
  async onDisapprove(participant:SurfParticipant){
    let res = await this.eventService.disapproveParticipant(this.eventID, participant, this.event);
    this.updated.emit(false);
  }



  getAge(birthDay) {
    return this.userService.getAge(birthDay);
  }
}
