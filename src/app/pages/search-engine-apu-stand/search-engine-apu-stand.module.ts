import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchEngineApuStandRoutingModule } from './search-engine-apu-stand-routing.module';
import { SearchEngineApuStandComponent } from './search-engine-apu-stand.component';
import { DetailSearchComponent } from './sub-pages/detail-search/detail-search.component';
import { SearchEngineDataService } from 'src/app/core/services/search-engine.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { DateFnsModule } from 'ngx-date-fns';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [SearchEngineApuStandComponent, DetailSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    SearchEngineApuStandRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    DateFnsModule,
    NgSelectModule,
    FormsModule,
  ],
  providers: [
    SearchEngineDataService,
    InventoryDataService,
    MasterManufactureDataService,
    MasterOwnerDataService,
    MasterAircraftDataService,
    MasterTypeDataService,
    MasterDestinationDataService,
  ],
})
export class SearchEngineApuStandModule {}
