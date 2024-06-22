import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DetailComponent } from './sub-pages/detail/detail.component';
import { RequestFormComponent } from '../request-form/request-form.component';
import { EditRequestFormComponent } from '../request-form/sub-pages/edit-request-form/edit-request-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'details/:requestId',
    component: DetailComponent,
  },
  {
    path: 'request-form',
    component: RequestFormComponent,
  },
  {
    path: 'edit/:requestId',
    component: EditRequestFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
