import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestDeliveryRoutingModule } from './request-delivery-routing.module';
import { RequestDeliveryComponent } from './request-delivery.component';


@NgModule({
  declarations: [
    RequestDeliveryComponent
  ],
  imports: [
    CommonModule,
    RequestDeliveryRoutingModule
  ]
})
export class RequestDeliveryModule { }
