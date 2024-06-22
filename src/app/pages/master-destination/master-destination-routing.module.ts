import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDestinationComponent } from './master-destination.component';

const routes: Routes = [{ path: '', component: MasterDestinationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDestinationRoutingModule { }
