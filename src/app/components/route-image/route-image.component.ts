import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-route-image',
  templateUrl: './route-image.component.html',
  styleUrls: ['./route-image.component.scss']
})
export class RouteImageComponent implements OnInit {
  @Input() imgPath: string;
  @Input() sizeToLoad: string; // small, medium, large
  @Input() width: string;
  @Input() height: string;
  @Input() number: number;
  @Input() alt: string = 'X';

  picUrl: string | null;
  constructor(private storage: AngularFireStorage) {}

  ngOnInit() {
      if (this.imgPath) {
      const ref = this.storage.ref(this.imgPath);
      ref.getDownloadURL().subscribe(
        res => {
          this.picUrl = res;
        },
        error => {
          switch (this.sizeToLoad) {
            case 'Small':
              this.picUrl = '/assets/images/profilePic_Small.jpg';
              break;
            case 'Medium':
              this.picUrl = '/assets/images/profilePic_Medium.jpg';
              break;
            case 'Large':
              this.picUrl = '/assets/images/profilePic_Large.jpg';
              break;
          }
        }
      );
    }
  }
}
