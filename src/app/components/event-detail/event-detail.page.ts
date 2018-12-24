import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {JoinEventPage} from '../join-event/join-event.page';
import {ActivatedRoute} from '@angular/router';
import {EventService} from '../../services/event.service';
import {RouteService} from '../../services/route.service';
import {SurfEvent} from '../../models/surfEvent'
import {SurfRoute} from '../../models/surfRoute';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  id: string;
  routeId:string;
  event: SurfEvent;
  route: SurfRoute;
  constructor(private modalController:ModalController,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private routeService: RouteService,
              private navCtrl: NavController) { }

  ngOnInit() {
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      this.routeId = this.activatedRoute.snapshot.paramMap.get('route');

      if(this.id && this.id !== '0') {
            this.eventService.getEvent(this.id).subscribe(value => {
                if (value) {
                    this.event = value;
                    this.loadFromEvent(this.event);//todo should be read only?
                } else {
                    //TODO go back
                }
            });
        }
        else if(this.routeId)
        {
            this.routeService.getRoute(this.routeId).subscribe(value => {
                if( value) {
                    this.route = value;
                    this.loadFromRoute(this.route);
                }
                else{
                    //TODO go back
                }
            });

        }
  }


     loadFromEvent(event: SurfEvent) {
        //TODO
         document.getElementById('create').style.visibility='hidden';

         alert('old event')
    }

     loadFromRoute(route: SurfRoute) {
      //TODO
         //should hide the join button
         document.getElementById('join').style.visibility='hidden';
         alert('create a new event form route')

     }

     onCreate(){
      //TODO
        this.eventService.addEvent(this.event);
        this.navCtrl.navigateRoot('home');
    }

  async onJoin(){
      const modal = await this.modalController.create({
          component: JoinEventPage,
          componentProps: { eventId: this.id }
      });
      return await modal.present();
  }

}
