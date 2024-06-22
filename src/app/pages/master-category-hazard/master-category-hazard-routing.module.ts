import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterCategoryHazardComponent } from './master-category-hazard.component';

const routes: Routes = [{ path: '', component: MasterCategoryHazardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterCategoryHazardRoutingModule { }
