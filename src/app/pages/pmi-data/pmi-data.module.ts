import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmiDataRoutingModule } from './pmi-data-routing.module';
import { PmiDataComponent } from './pmi-data.component';


@NgModule({
  declarations: [
    PmiDataComponent
  ],
  imports: [
    CommonModule,
    PmiDataRoutingModule
  ]
})
export class PmiDataModule { }
