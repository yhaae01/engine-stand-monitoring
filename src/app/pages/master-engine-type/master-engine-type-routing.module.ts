import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterEngineTypeComponent } from './master-engine-type.component';

const routes: Routes = [{ path: '', component: MasterEngineTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterEngineTypeRoutingModule { }
