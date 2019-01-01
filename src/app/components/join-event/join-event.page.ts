import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {SurfRoute} from '../../models/surfRoute';
import {SurfParticipant} from '../../models/surfParticipant';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';

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
  constructor(private navParams: NavParams,
              private modalController: ModalController,
              private eventService:EventService,
              private formBuilder: FormBuilder,
              private userService: UserService) { }

  async ngOnInit() {
      this.eventID = this.navParams.get('eventId');



      window.form = this.joinEventForm;
      this.user = await this.userService.getCurrentUserPromise();

      this.joinEventForm = this.formBuilder.group({
          phone: [this.user.phone, Validators.required],
          email: [this.user.email, Validators.required],
          equipment: [''],
          car: [false, Validators.required],
          places: [0, Validators.required],
          message: ['']
      });
  }

    async joinAndCloseModal() {
      if(!this.joinEventForm.valid)
      {
          alert('form is not valid');
          return;
      }
        this.mapFormValuesToParticipantModel();

        let returnedId;
        return this.eventService.joinEvent(this.eventID,this.participant).then(()=>{
            return this.modalController.dismiss(true);
        });
    }

    mapFormValuesToParticipantModel() {
      this.participant.id =this.user.id;
        this.participant.phone = this.joinEventForm.value.phone;
        this.participant.email = this.joinEventForm.value.email;
        this.participant.groupEquipmentIBring = this.joinEventForm.value.equipment;
        if(this.joinEventForm.value.car){
            this.participant.offeringSeatsInCar = this.joinEventForm.value.places;
        }
        else{
            this.participant.needSeatInCar = true;
            this.participant.isStandByForCar = true;
            this.participant.userIdOfHostingCar = '';//TODO

        }
        this.participant.approved = 0;
        //this.joinEventForm.value.message;

    }
}
