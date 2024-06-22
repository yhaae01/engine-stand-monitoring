import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterJobDescComponent } from './master-job-desc.component';

const routes: Routes = [{ path: '', component: MasterJobDescComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterJobDescRoutingModule { }
