import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterOwnerRoutingModule } from './master-owner-routing.module';
import { MasterOwnerComponent } from './master-owner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeroIconModule } from 'ng-heroicon';
import { MasterOwnerDataService } from 'src/app/core/services/master-owner-data.service';

@NgModule({
  declarations: [MasterOwnerComponent],
  imports: [
    CommonModule,
    MasterOwnerRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
  ],
  providers: [MasterOwnerDataService],
})
export class MasterOwnerModule {}
