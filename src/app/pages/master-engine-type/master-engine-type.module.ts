import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterEngineTypeRoutingModule } from './master-engine-type-routing.module';
import { MasterEngineTypeComponent } from './master-engine-type.component';
import { MasterTypeDataService } from 'src/app/core/services/master-type-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MasterEngineTypeComponent],
  imports: [
    CommonModule,
    MasterEngineTypeRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [MasterTypeDataService],
})
export class MasterEngineTypeModule {}
