import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDestinationRoutingModule } from './master-destination-routing.module';
import { MasterDestinationComponent } from './master-destination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';

@NgModule({
  declarations: [MasterDestinationComponent],
  imports: [
    CommonModule,
    MasterDestinationRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
  ],
  providers: [MasterDestinationDataService],
})
export class MasterDestinationModule {}
