import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchEngineApuStandComponent } from './search-engine-apu-stand.component';
import { DetailSearchComponent } from './sub-pages/detail-search/detail-search.component';

const routes: Routes = [
  { path: '', component: SearchEngineApuStandComponent },
  {
    path: 'detail-search/:equipmentId',
    component: DetailSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchEngineApuStandRoutingModule {}
