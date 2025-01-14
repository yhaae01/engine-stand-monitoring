import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmiPartDetailComponent } from './pmi-part-detail.component';

const routes: Routes = [{ path: '', component: PmiPartDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmiPartDetailRoutingModule { }
