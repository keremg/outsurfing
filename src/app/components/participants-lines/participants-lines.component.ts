import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'participants-lines',
  templateUrl: './participants-lines.component.html',
  styleUrls: ['./participants-lines.component.scss']
})
export class ParticipantsLinesComponent implements OnInit {

  constructor(private userService: UserService) { }

  //@Input() participant;
  @Input() eventObs;
  @Input() isApprovedLines;

  ngOnInit() {
  }

  getAge(birthDay) {
    return this.userService.getAge(birthDay);
  }
}
