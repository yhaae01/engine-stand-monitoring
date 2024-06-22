import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { DetailInventoryComponent } from './sub-pages/detail-inventory/detail-inventory.component';
import { OutgoingFormComponent } from './sub-pages/outgoing-form/outgoing-form.component';
import { AddDataInventoryComponent } from './sub-pages/add-data-inventory/add-data-inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';
import { MasterAircraftDataService } from 'src/app/core/services/master-aircraft-data.service';
import { HeroIconModule } from 'ng-heroicon';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { EditDataInventoryComponent } from './sub-pages/edit-data-inventory/edit-data-inventory.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DateFnsModule } from 'ngx-date-fns';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    InventoryComponent,
    DetailInventoryComponent,
    OutgoingFormComponent,
    AddDataInventoryComponent,
    EditDataInventoryComponent,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    DateFnsModule,
    SharedModule,
    NgSelectModule,
  ],
  providers: [
    InventoryDataService,
    MasterManufactureDataService,
    MasterOwnerDataService,
    MasterAircraftDataService,
    MasterTypeDataService,
    MasterDestinationDataService,
  ],
})
export class InventoryModule {}
