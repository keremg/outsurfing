import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RatingComponent} from './rating.component';


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
  declarations: [RatingComponent],
    exports: [
        RatingComponent
    ]
})
export class RatingComponentModule {}
