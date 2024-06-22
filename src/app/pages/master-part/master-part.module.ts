import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterPartRoutingModule } from './master-part-routing.module';
import { MasterPartComponent } from './master-part.component';


@NgModule({
  declarations: [
    MasterPartComponent
  ],
  imports: [
    CommonModule,
    MasterPartRoutingModule
  ]
})
export class MasterPartModule { }
