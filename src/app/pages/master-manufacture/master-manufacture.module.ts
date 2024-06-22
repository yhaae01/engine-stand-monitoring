import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterManufactureRoutingModule } from './master-manufacture-routing.module';
import { MasterManufactureComponent } from './master-manufacture.component';
import { MasterManufactureDataService } from 'src/app/core/services/master-manufacture-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasterManufactureComponent],
  imports: [
    CommonModule,
    MasterManufactureRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [MasterManufactureDataService],
})
export class MasterManufactureModule {}
