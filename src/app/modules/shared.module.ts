import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouteImageComponent} from '../components/route-image/route-image.component';




@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [RouteImageComponent],
    exports: [RouteImageComponent],
})

export class SharedModule {}
