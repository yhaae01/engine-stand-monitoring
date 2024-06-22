import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestDateRoutingModule } from './request-date-routing.module';
import { RequestDateComponent } from './request-date.component';


@NgModule({
  declarations: [
    RequestDateComponent
  ],
  imports: [
    CommonModule,
    RequestDateRoutingModule
  ]
})
export class RequestDateModule { }
