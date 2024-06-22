import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmiSheetRoutingModule } from './pmi-sheet-routing.module';
import { PmiSheetComponent } from './pmi-sheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PmiSheetService } from 'src/app/core/services/pmi-sheet-data.service';
import { HeroIconModule } from 'ng-heroicon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PmiSheetComponent],
  imports: [
    CommonModule,
    PmiSheetRoutingModule,
    ReactiveFormsModule,
    HeroIconModule,
    FormsModule,
    SharedModule,
  ],
  providers: [PmiSheetService],
})
export class PmiSheetModule {}
