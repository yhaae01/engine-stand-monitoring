import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRectificationRoutingModule } from './master-rectification-routing.module';
import { MasterRectificationComponent } from './master-rectification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterRectificationDataService } from 'src/app/core/services/master-rectification-data.service';

@NgModule({
  declarations: [MasterRectificationComponent],
  imports: [
    CommonModule,
    MasterRectificationRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [MasterRectificationDataService],
})
export class MasterRectificationModule {}
