import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {EventService} from '../../services/event.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {SurfRoute} from '../../models/surfRoute';
import {SurfParticipant} from '../../models/surfParticipant';

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

  constructor(private navParams: NavParams, private modalController: ModalController,
              private eventService:EventService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.eventID = this.navParams.get('eventId');

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

    joinAndCloseModal() {
        this.mapFormValuesToRouteModel();

        let returnedId;
        /*if (!this.viewMode && this.id) {
            //update
            await this.routesService.updateRoute(this.id, copyOfRoute);
            returnedId = this.id;
        }
        if (!returnedId) {*/
        returnedId = this.eventService.joinEvent(this.eventID,this.participant)

        //}

        this.modalController.dismiss();
        return returnedId;
    }

    mapFormValuesToRouteModel() {
        this.participant.phone = this.joinEventForm.value.phone;
        this.participant.email = this.joinEventForm.value.email;
        this.participant.groupEquipmentIBring = this.joinEventForm.value.equipment;
        if(this.joinEventForm.value.car){
            this.participant.offeringSeatsInCar = this.joinEventForm.value.places;
        }
        else{
            this.participant.needSeatInCar = true;
            this.participant.isStandByForCar = true;
            this.participant.userIdOfHostingCar = 'fdsadsa';//TODO

        }
        //this.joinEventForm.value.message;

    }
}
