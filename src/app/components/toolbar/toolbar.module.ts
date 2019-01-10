import { NgModule } from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ChooseRoute} from '../ChooseRoute/ChooseRoute.page';
import {ToolbarComponent} from './toolbar.component';
import {RouteImageComponentModule} from '../route-image/route-image.module';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouteImageComponentModule
    ],
  declarations: [ToolbarComponent],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarComponentModule {}
