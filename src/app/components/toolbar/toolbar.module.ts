import { NgModule } from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ChooseRoute} from '../ChooseRoute/ChooseRoute.page';
import {ToolbarComponent} from './toolbar.component';



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
  declarations: [ToolbarComponent],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarComponentModule {}
