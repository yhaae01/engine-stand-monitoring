import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { EditDataInventoryComponent } from './sub-pages/edit-data-inventory/edit-data-inventory.component';
import { DetailInventoryComponent } from './sub-pages/detail-inventory/detail-inventory.component';
import { AddDataInventoryComponent } from './sub-pages/add-data-inventory/add-data-inventory.component';
import { OutgoingFormComponent } from './sub-pages/outgoing-form/outgoing-form.component';

const routes: Routes = [
  { path: '', component: InventoryComponent },
  {
    path: 'detail/:equipmentId',
    component: DetailInventoryComponent,
  },
  {
    path: 'edit/:equipmentId',
    component: EditDataInventoryComponent,
  },
  {
    path: 'add-data-inventory',
    component: AddDataInventoryComponent,
  },
  {
    path: 'detail-inventory',
    component: DetailInventoryComponent,
  },
  {
    path: 'outgoing/:equipmentId',
    component: OutgoingFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
