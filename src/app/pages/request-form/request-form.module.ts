import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestFormRoutingModule } from './request-form-routing.module';
import { RequestFormComponent } from './request-form.component';
import { EditRequestFormComponent } from './sub-pages/edit-request-form/edit-request-form.component';
import { AddRequestFormComponent } from './sub-pages/add-request-form/add-request-form.component';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { MasterDestinationDataService } from 'src/app/core/services/master-destination-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { RequestDataService } from 'src/app/core/services/request-data.service';
import { MasterJobDescDataService } from 'src/app/core/services/master-job-desc-data.service';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RequestFormComponent,
    EditRequestFormComponent,
    AddRequestFormComponent,
  ],
  imports: [
    CommonModule,
    RequestFormRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
  ],
  providers: [
    UserDataService,
    MasterDestinationDataService,
    RequestDataService,
    MasterJobDescDataService,
    InventoryDataService,
  ],
})
export class RequestFormModule {}
