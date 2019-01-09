import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, PopoverController} from '@ionic/angular';
import {query} from '@angular/core/src/render3/query';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-filter-events',
  templateUrl: './filter-events.page.html',
  styleUrls: ['./filter-events.page.scss'],
})
export class FilterEventsPage implements OnInit {
  query:string;
  filter:any;
    public filterForm: FormGroup;
    isRoute:boolean = false;


    constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private popoverCtrl: PopoverController,
              private navParams: NavParams) { }

  ngOnInit() {
      this.query = this.navParams.get('query');
      this.filter = this.navParams.get('filter');
      this.isRoute = this.navParams.get('isRoute');
      if(!this.query)
        this.query='0'

      this.query='/'+this.query+'/';


      this.filterForm = this.formBuilder.group({
          lengthKM: [0],
          routeDifficulty: [0],
          routeDuration: [0],
          routeDurationUnits: ['hours'],//TODO use duration
          routeProperties: [''],
          recommendedMonths: ['']
      });

      if(this.filter) {
          let filterProps:any = {};
          filterProps.lengthKM = this.filter['lengthKM'] || 0;
          filterProps.routeDifficulty = this.filter['routeDifficulty'] || 0;
          filterProps.routeDuration = this.filter['routeDuration'] || 0;
          filterProps.routeDurationUnits = this.filter['routeDurationUnits'] || 'hours';
          filterProps.routeProperties = this.filter['routeProperties'] || '';
          filterProps.recommendedMonths = this.filter['recommendedMonths'] || '';

          this.filterForm.patchValue({
              lengthKM: filterProps.lengthKM,
              routeDifficulty: filterProps.routeDifficulty,
              routeDuration: filterProps.routeDuration,
              routeDurationUnits: filterProps.routeDurationUnits,
              routeProperties: filterProps.routeProperties,
              recommendedMonths: filterProps.recommendedMonths
          });
      }
      else{
          this.filter={};
      }
    }

  go() {
    this.popoverCtrl.dismiss();
    if(this.filterForm.value.lengthKM && this.filterForm.value.lengthKM !== 0){
        this.filter['lengthKM'] = this.filterForm.value.lengthKM;
    }
      if(this.filterForm.value.routeDifficulty && this.filterForm.value.routeDifficulty !== 0){
          this.filter['routeDifficulty'] = this.filterForm.value.routeDifficulty;
      }
      if(this.filterForm.value.routeDuration && this.filterForm.value.routeDuration !== 0){
          this.filter['routeDuration'] = this.filterForm.value.routeDuration;
      }

      let base;
      if(this.isRoute)
          base = 'ChooseRoute';
      else
          base='home';
      this.navCtrl.navigateRoot(base+this.query+this.getFilterText());
  }

    getFilterText(){
        if(this.filter) {
            let str = '';
            for (let f in this.filter) {
                str+= f +'.' +this.filter[f]+'&';
            }
            return str;
        }
        return '';
    }

    checkedid = 0;
    inOther: boolean = false;
    check(x){
        if(!this.inOther) {
            this.inOther = true;
            this.checkedid = x;
            for (let i = 0; i < 3; i++) {
                if (i !== x) {
                    let c: any = document.getElementById(i.toString());
                    c.checked = false;
                }
            }
            this.inOther = false;
        }
    }
}
