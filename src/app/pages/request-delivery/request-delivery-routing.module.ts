import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestDeliveryComponent } from './request-delivery.component';

const routes: Routes = [{ path: '', component: RequestDeliveryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestDeliveryRoutingModule { }
