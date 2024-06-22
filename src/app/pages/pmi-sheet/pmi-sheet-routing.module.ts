import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmiSheetComponent } from './pmi-sheet.component';

const routes: Routes = [{ path: '', component: PmiSheetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmiSheetRoutingModule { }
