import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-route-image',
  templateUrl: './route-image.component.html',
  styleUrls: ['./route-image.component.scss']
})
export class RouteImageComponent implements OnInit {
    @Input() imgPath: string ;
    @Input() sizeToLoad: string; // small, medium, large
    @Input() width: string;
    @Input() height: string;

    picUrl: Observable<string | null>;
  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
//      console.log(this.imgPath);
      if(this.imgPath && this.imgPath !== '') {
          const ref = this.storage.ref(this.imgPath);
          this.picUrl = ref.getDownloadURL();
      }
  }

}
