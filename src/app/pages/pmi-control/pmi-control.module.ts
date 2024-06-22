import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmiControlRoutingModule } from './pmi-control-routing.module';
import { PmiControlComponent } from './pmi-control.component';
import { InsertPmiDataComponent } from './sub-pages/insert-pmi-data/insert-pmi-data.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { PmiControlDataService } from 'src/app/core/services/pmi-control.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterAircraftTypeModule } from '../master-aircraft-type/master-aircraft-type.module';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { DateFnsModule } from 'ngx-date-fns';

@NgModule({
  declarations: [PmiControlComponent, InsertPmiDataComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    PmiControlRoutingModule,
    SharedModule,
    DateFnsModule,
  ],
  providers: [
    PmiControlDataService,
    MasterAircraftDataService,
    MasterTypeDataService,
    MasterManufactureDataService,
    InventoryDataService,
  ],
})
export class PmiControlModule {}
