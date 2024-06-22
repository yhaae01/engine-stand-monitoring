import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmiControlComponent } from './pmi-control.component';
import { InsertPmiDataComponent } from './sub-pages/insert-pmi-data/insert-pmi-data.component';

const routes: Routes = [
  { path: '', component: PmiControlComponent },
  {
    path: 'insert-pmi-data/:equipmentId',
    component: InsertPmiDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmiControlRoutingModule {}
