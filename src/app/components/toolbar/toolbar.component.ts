import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  currentUserId: string;
  constructor(private authService: AuthService,
              private navCtrl: NavController) { }
    @Input() defaultBack: string ;
    @Input() title: string ;
    @Input() loggedIn: boolean;

  ngOnInit() {
      if(this.loggedIn === null){
          this.loggedIn=true;
      }
      this.currentUserId = this.authService.currentUserId;
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

}
