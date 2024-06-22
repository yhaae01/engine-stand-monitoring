import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterJobDescRoutingModule } from './master-job-desc-routing.module';
import { MasterJobDescComponent } from './master-job-desc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { MasterJobDescDataService } from 'src/app/core/services/master-job-desc-data.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasterJobDescComponent],
  imports: [
    CommonModule,
    MasterJobDescRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    SharedModule,
    FormsModule,
  ],
  providers: [MasterJobDescDataService],
})
export class MasterJobDescModule {}
