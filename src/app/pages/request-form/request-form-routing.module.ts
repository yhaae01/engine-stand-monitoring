import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestFormComponent } from './request-form.component';
import { EditRequestFormComponent } from './sub-pages/edit-request-form/edit-request-form.component';
import { AddRequestFormComponent } from './sub-pages/add-request-form/add-request-form.component';

const routes: Routes = [
  { path: '', component: RequestFormComponent },
  {
    path: 'edit/:requestId',
    component: EditRequestFormComponent,
  },
  {
    path: 'add/:equipmentId',
    component: AddRequestFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestFormRoutingModule {}
