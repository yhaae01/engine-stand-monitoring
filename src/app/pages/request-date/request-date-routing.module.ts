import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestDateComponent } from './request-date.component';

const routes: Routes = [{ path: '', component: RequestDateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestDateRoutingModule { }
