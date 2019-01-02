import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';
import {PaginationService} from '../../services/pagination.service';
import {UserService} from '../../services/user.service';
import {SurfUser} from '../../models/surfUser';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers:[PaginationService],
})

export class HomePage implements OnInit {
    currentUser:SurfUser;
    onlyMine:boolean = false;

    constructor(
        public navCtrl: NavController,
        private authService: AuthService,
        public page: PaginationService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {

    }


    async ngOnInit() {
        this.currentUser = await this.userService.getCurrentUserPromise();
        let query = this.activatedRoute.snapshot.paramMap.get('q')
        if (query == this.currentUser.id) {
            this.onlyMine = true;
        }
        if (this.onlyMine) {
            this.page.init('events', this.currentUser.id, {reverse: true, prepend: false}, this.currentUser.id);
        } else {
            if(query)
                this.page.init('events', 'name', {reverse: true, prepend: false}, null, query);
            else
                this.page.init('events', 'name', {reverse: true, prepend: false});
        }

        const searchbar = document.getElementById('search')
        searchbar.addEventListener('ionChange', (ev) => {
            let q = (ev as CustomEvent).detail.value;
            return this.navCtrl.navigateForward('home/' + q);

        })

    }

    onMytrips(){
        return this.navCtrl.navigateForward('home/' + this.currentUser.id);
    }

    ShowEventDetail(eventId: string) {
        return this.navCtrl.navigateForward('EventDetail/' + eventId + '/0');
    }

    logout() {
        this.authService.logoutUser().then(() => {
            this.navCtrl.navigateRoot('');
        }).catch(() => {
                console.log('error in logout');
            }
        );

    }

    loadData(event) {
        this.page.more();

        console.log('Done');
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        //if (this.page.done) {
        //event.target.disabled = true;
        //}
    }


}

