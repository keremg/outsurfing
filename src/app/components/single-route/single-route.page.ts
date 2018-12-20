import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Route} from '../../models/Route';
import * as _ from 'lodash';
import {User} from '../../models/User';
//import { ImagePicker } from '@ionic-native/image-picker';

declare let window: any;

@Component({
  selector: 'app-single-route',
  templateUrl: './single-route.page.html',
  styleUrls: ['./single-route.page.scss']
})
export class SingleRoutePage implements OnInit {
  public singleRouteForm: FormGroup;
  selectedFile: File = null;
  route: Route = new Route();

  constructor(private formBuilder: FormBuilder /* private imagePicker: ImagePicker*/) {
    window.route = this;


  }

  ngOnInit() {
    this.singleRouteForm = this.formBuilder.group({
      name: ['', Validators.required],
      isGuide: ['', Validators.required],
      creatorName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      tripPrice: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      tripLevel: ['', Validators.required],
      tripDuration: ['', Validators.required],
      properties: ['', Validators.required],
      photos: [''],
      recMonths: [''],
      fee: [''],
      gMapsLocation: ['', Validators.required]
    });

    window.form = this.singleRouteForm;

    //TODO here we should get the route data from DB
    this.route.id = '555';
    this.route.name = 'route name';
    this.route.country = 'Israel';
    this.route.state = 'Israel';
    this.route.routeStartLocation = 'Zeelim parking';
    this.route.routeEndLocation = 'Namer spring';
    this.route.imagesUrls = ['file-name-here?'];
    this.route.mapUrl = 'https://he.wikipedia.org/wiki/%D7%A0%D7%97%D7%9C_%D7%A6%D7%90%D7%9C%D7%99%D7%9D#/media/File:NahalTzeelim01_ST_04.jpg';
    this.route.lengthKM = 8;
    this.route.shortDescription = 'חול אבנים ועוד חול';
    this.route.longDescription = 'kuk kuu aksu adkscu';
    this.route.routeRanking =  [{ranking: 3, review: 'nice'}];
    this.route.routeDifficulty = 3; // Level:  0 - very easy, 1-easy, 2-moderate, 3-challenging, 4-extreme, 5-very extreme
    this.route.routeDuration = 1; // will represent number of days, so half day should be 0.5 , one hour should be 0.04
    this.route.routeProperties = ['water', 'desert', 'canyon']; // -	e.g. water, swimming, mountains, bicycles, forest, desert, oasis, historical, archeology, ropes

    this.route.routeCreatorId = 'hgf6yi9';
    this.route.routeCreator = {firstName: 'Tidhar', lastName: 'Seifer', isGuide: true}; //new User(); // {id: 'hgf6yi9', name: 'Adi'};
    this.route.isGuidingOffered = false;
    this.route.offeredPrice = 0; // default 0, more if isGuidingOffered
    this.route.guideContactDetails = '0541223681'; // ree text allowing the guide to describe email and/or phone for contacting him/her about guidance
    this.route.enteranceFee = 20;
    this.route.requiredEquipment = 'shoes, pancake';
    this.route.numEventsCreatedFromRoute = 59689;
    this.route.recommendedMonths = [1, 2, 3, 4, 10, 11, 12];


    this.editForm(this.route);


  }

  editForm(route: Route) {
    this.singleRouteForm.patchValue({
      name: route.name,
      isGuide: route.routeCreator.isGuide, //TODO: Should be out of form, just label
      creatorName: route.routeCreator.firstName + ' ' + route.routeCreator.lastName, //TODO: Should be out of form, just label
      phoneNumber: route.guideContactDetails,
      shortDescription: route.shortDescription
    });
  }


  onFileSelected(event) {
    this.selectedFile = <File>event.target.value;
    console.log(this.selectedFile);
    // checking the file isn't null
  }

  onUpload() {
    let desc = '';
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    console.log(fd);
  }

  updateRoute() {
    alert('here should save the route');
    this.mapFormValuesToRouteModel();
    let copyOfRoute = _.cloneDeep(this.route);
    if (this.route.id !== '') {
      //update
    } else {
      //create new
    }


  }

  mapFormValuesToRouteModel() {
    this.route.name = this.singleRouteForm.value.name;
    this.route.shortDescription = this.singleRouteForm.value.shortDescription;
  }
}
