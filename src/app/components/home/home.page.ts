import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
import { PaginationService } from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import { SurfUser } from '../../models/surfUser';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { Observable } from 'rxjs';
import { SurfEvent } from '../../models/SurfEvent';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PaginationService]
})
export class HomePage implements OnInit {
  currentUser: SurfUser;
  onlyMine: boolean = false;
  query: string;
  searched: boolean;

  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    public page: PaginationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.userService.getCurrentUserPromise();
    this.query = this.activatedRoute.snapshot.paramMap.get('q');
    if (this.query == this.currentUser.id) {
      this.onlyMine = true;
    }

    if (this.onlyMine) {
      this.page.init(
        'events',
        this.currentUser.id,
        { reverse: true, prepend: false },
        this.currentUser.id
      );
    } else {
      if (this.query)
        this.page.init(
          'events',
          'name',
          { reverse: true, prepend: false },
          null,
          this.query
        );
      else this.page.init('events', 'name', { reverse: true, prepend: false });
    }

    const searchbar = document.getElementById('search');
  }

  search(ev) {
    let q = (ev as CustomEvent).detail.value;
    this.navCtrl.navigateRoot('home/' + q);
  }

  hideElement(id: string, val: boolean) {
    let ele = document.getElementById(id);
    if (ele) {
      ele.hidden = val;
      //ele.parentNode.removeChild(ele);
    } else {
      console.log(id);
    }
  }

  onMytrips() {
    return this.navCtrl.navigateForward('home/' + this.currentUser.id);
  }

  onShowAll() {
    return this.navCtrl.navigateForward('home');
  }

  ShowEventDetail(eventId: string) {
    return this.navCtrl.navigateForward('EventDetail/' + eventId + '/0');
  }

  logout() {
    this.authService
      .logoutUser()
      .then(() => {
        this.navCtrl.navigateRoot('');
      })
      .catch(() => {
        console.log('error in logout');
      });
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

  routeImageUrl(surfRoute: SurfEvent) {
    if (surfRoute.imagesUrls && surfRoute.imagesUrls.length > 0) {
      return 'routes/' + surfRoute.routeId + '/' + surfRoute.imagesUrls[0];
    }
    return '';
  }
}
