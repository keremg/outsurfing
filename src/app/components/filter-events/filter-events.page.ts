import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, PopoverController} from '@ionic/angular';
import {query} from '@angular/core/src/render3/query';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurfUser} from '../../models/surfUser';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-filter-events',
    templateUrl: './filter-events.page.html',
    styleUrls: ['./filter-events.page.scss'],
})
export class FilterEventsPage implements OnInit {
    query: string;
    filter: any;
    user: SurfUser;
    public filterForm: FormGroup;
    isRoute: boolean = false;
    checkedid = -1;


    constructor(private navCtrl: NavController,
                private formBuilder: FormBuilder,
                private popoverCtrl: PopoverController,
                private navParams: NavParams,
                private userService: UserService) {
    }


    ngOnInit() {
        this.query = this.navParams.get('query');
        this.filter = this.navParams.get('filter');
        this.isRoute = this.navParams.get('isRoute');
        this.user = this.navParams.get('currentUser');
        if (!this.query) {
            this.query = '0';
        }

        this.query = '/' + this.query + '/';

        this.filterForm = this.formBuilder.group({
            lengthKMFrom: [0], // range from to
            lengthKMTo: [99999], // range from to
            routeDifficultyFrom: [0], // range from to
            routeDifficultyTo: [5], // range from to
            routeDurationFrom: [0], // range from to
            routeDurationTo: [99999], // range from to
            routeDurationUnits: ['hours'],//TODO use duration
            country: [this.userService.country], //default is user's current country
            state: [this.userService.state],
            routeProperties: [''],
            recommendedMonths: ['']
        });

        this.checkedid = (!this.filter)? -1 : (this.filter.lengthKM)? 0 : (this.filter.routeDuration)? 1 : (this.filter.routeDifficulty)? 2: -1;

        if (this.filter) {
            let filterProps: any = {};
            filterProps.lengthKM = this.filter['lengthKM'] || [0, 99999]; // range from to
            filterProps.routeDifficulty = this.filter['routeDifficulty'] || [0, 5]; // range from to
            filterProps.routeDuration = this.filter['routeDuration'] || [0, 99999]; // range from to
            filterProps.routeDurationUnits = this.filter['routeDurationUnits'] || 'hours';
            filterProps.country = this.filter['country'] || (this.filter['country'] === undefined)? this.userService.country : ''; //default is user's current country
            filterProps.state = this.filter['state'] || (this.filter['state'] === undefined)? this.userService.state : '';
            filterProps.routeProperties = this.filter['routeProperties'] || '';
            filterProps.recommendedMonths = this.filter['recommendedMonths'] || '';

            this.filterForm.patchValue({
                lengthKMFrom: filterProps.lengthKM[0],
                lengthKMTo: filterProps.lengthKM[1],
                routeDurationFrom: filterProps.routeDuration[0],
                routeDurationTo: filterProps.routeDuration[1],
                routeDifficultyFrom: filterProps.routeDifficulty[0],
                routeDifficultyTo: filterProps.routeDifficulty[1],
                routeDurationUnits: filterProps.routeDurationUnits,
                country: filterProps.country,
                state: filterProps.state,
                routeProperties: filterProps.routeProperties,
                recommendedMonths: filterProps.recommendedMonths
            });
        } else {
            this.filter = {};
        }
    }

    go() {
        this.popoverCtrl.dismiss();
        this.filter = {}; //reset the filter
        if (this.checkedid === 0) { // this.filterForm.value.lengthKMFrom && this.filterForm.value.lengthKMFrom !== 0){
            this.filter['lengthKM'] = [this.filterForm.value.lengthKMFrom, this.filterForm.value.lengthKMTo];
        }

        if (this.checkedid === 1) { // this.filterForm.value.routeDuration && this.filterForm.value.routeDuration !== 0){
            this.filter['routeDuration'] = [this.filterForm.value.routeDurationFrom, this.filterForm.value.routeDurationTo];
        }
        if (this.checkedid === 2) { //this.filterForm.value.routeDifficulty && this.filterForm.value.routeDifficulty !== 0){
            this.filter['routeDifficulty'] = [this.filterForm.value.routeDifficultyFrom, this.filterForm.value.routeDifficultyTo];
        }
        if (this.filterForm.value.country !== undefined) {
            // In any case, to allow ALL if empty
            this.filter['country'] = this.filterForm.value.country;
        }
        if (this.filterForm.value.state) {
            this.filter['state'] = this.filterForm.value.state;
        }


        let base;
        if (this.isRoute) {
            base = 'ChooseRoute';
        } else {
            base = 'home';
        }

        let urlToOpen = base + this.query;
        if (this.filter) {
            let queryStr = JSON.stringify(this.filter);
            queryStr = encodeURIComponent(queryStr);
            urlToOpen += 'f_' + queryStr + '?';
        }
        this.navCtrl.navigateRoot(urlToOpen);

    }


    check(x) {
        if (this.checkedid >= 0 && this.checkedid !== x) {
            switch (this.checkedid) {
                case 0: {
                    this.filterForm.patchValue({
                        lengthKMFrom: 0,
                        lengthKMTo: 99999
                    });
                    break;
                }
                case 1: {
                    this.filterForm.patchValue({
                        routeDurationFrom: 0,
                        routeDurationTo: 99999
                    });
                    break;
                }
                case 2: {
                    this.filterForm.patchValue({
                        routeDifficultyFrom: 0,
                        routeDifficultyTo: 5
                    });
                    break;
                }
            }
        }

        this.checkedid = x;
    }
}
