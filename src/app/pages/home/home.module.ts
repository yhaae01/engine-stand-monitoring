import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DetailComponent } from './sub-pages/detail/detail.component';
import { InventoryRoutingModule } from '../inventory/inventory-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { HomeDataService } from 'src/app/core/services/home-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [HomeComponent, DetailComponent],
  providers: [
    InventoryDataService,
    MasterManufactureDataService,
    MasterOwnerDataService,
    MasterAircraftDataService,
    MasterTypeDataService,
    MasterDestinationDataService,
    HomeDataService,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
  ],
})
export class HomeModule {}
