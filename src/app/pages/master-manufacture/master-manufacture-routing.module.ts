import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterManufactureComponent } from './master-manufacture.component';

const routes: Routes = [{ path: '', component: MasterManufactureComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterManufactureRoutingModule { }
