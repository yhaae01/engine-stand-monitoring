import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportHazardRoutingModule } from './report-hazard-routing.module';
import { ReportHazardComponent } from './report-hazard.component';
import { AddReportHazardComponent } from './sub-pages/add-report-hazard/add-report-hazard.component';
import { DetailReportHazardComponent } from './sub-pages/detail-report-hazard/detail-report-hazard.component';
import { MasterCategoryDataService } from 'src/app/core/services/master-category-data.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { InventoryDataService } from 'src/app/core/services/inventory-data.service';
import { ReportHazardDataService } from 'src/app/core/services/report-hazard-data.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterRectificationDataService } from 'src/app/core/services/master-rectification-data.service';
import { DateFnsModule } from 'ngx-date-fns';

@NgModule({
  declarations: [
    ReportHazardComponent,
    AddReportHazardComponent,
    DetailReportHazardComponent,
  ],
  imports: [
    CommonModule,
    ReportHazardRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    DateFnsModule,
  ],
  providers: [
    InventoryDataService,
    MasterCategoryDataService,
    ReportHazardDataService,
    MasterRectificationDataService,
  ],
})
export class ReportHazardModule {}
