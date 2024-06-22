import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MasterAircraftTypeComponent from './master-aircraft-type.component';

const routes: Routes = [{ path: '', component: MasterAircraftTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterAircraftTypeRoutingModule {}
