import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmiPartDetailRoutingModule } from './pmi-part-detail-routing.module';
import { PmiPartDetailComponent } from './pmi-part-detail.component';


@NgModule({
  declarations: [
    PmiPartDetailComponent
  ],
  imports: [
    CommonModule,
    PmiPartDetailRoutingModule
  ]
})
export class PmiPartDetailModule { }
