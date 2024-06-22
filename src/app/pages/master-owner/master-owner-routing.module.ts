import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterOwnerComponent } from './master-owner.component';

const routes: Routes = [{ path: '', component: MasterOwnerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterOwnerRoutingModule { }
