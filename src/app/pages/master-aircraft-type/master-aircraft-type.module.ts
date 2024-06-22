import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterAircraftTypeRoutingModule } from './master-aircraft-type-routing.module';
import MasterAircraftTypeComponent from './master-aircraft-type.component';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasterAircraftTypeComponent],
  imports: [
    CommonModule,
    MasterAircraftTypeRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [MasterAircraftDataService],
})
export class MasterAircraftTypeModule {}
