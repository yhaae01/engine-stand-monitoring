import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterCategoryHazardRoutingModule } from './master-category-hazard-routing.module';
import { MasterCategoryHazardComponent } from './master-category-hazard.component';
import { MasterCategoryDataService } from 'src/app/core/services/master-category-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasterCategoryHazardComponent],
  imports: [
    CommonModule,
    MasterCategoryHazardRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [MasterCategoryDataService],
})
export class MasterCategoryHazardModule {}
