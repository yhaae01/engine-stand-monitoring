import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportHazardComponent } from './report-hazard.component';
import { AddReportHazardComponent } from './sub-pages/add-report-hazard/add-report-hazard.component';
import { DetailReportHazardComponent } from './sub-pages/detail-report-hazard/detail-report-hazard.component';

const routes: Routes = [
  { path: '', component: ReportHazardComponent },
  {
    path: 'add-report-hazard',
    component: AddReportHazardComponent,
  },
  {
    path: 'detail-report-hazard/:hazardId',
    component: DetailReportHazardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportHazardRoutingModule {}
