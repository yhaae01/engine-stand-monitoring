import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterPartComponent } from './master-part.component';

const routes: Routes = [{ path: '', component: MasterPartComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPartRoutingModule { }
