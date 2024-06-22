import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterRectificationComponent } from './master-rectification.component';

const routes: Routes = [{ path: '', component: MasterRectificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRectificationRoutingModule { }
