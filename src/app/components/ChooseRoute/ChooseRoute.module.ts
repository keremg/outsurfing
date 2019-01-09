import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { ChooseRoute } from './ChooseRoute.page';
import {RouteImageComponentModule} from '../route-image/route-image.module';
import {ToolbarComponentModule} from '../toolbar/toolbar.module';
import {FilterEventsPage} from '../filter-events/filter-events.page';
import {FilterEventsPageModule} from '../filter-events/filter-events.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouteImageComponentModule,
      ToolbarComponentModule,
      FilterEventsPageModule,
      RouterModule.forChild([
      {
        path: '',
        component: ChooseRoute
      }
    ])
  ],
  declarations: [ChooseRoute],
    entryComponents: [FilterEventsPage]

})
export class ChooseRoutePageModule {}
