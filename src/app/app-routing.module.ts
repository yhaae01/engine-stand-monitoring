import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    // data: {
    //   roles: ['project_manager', 'group_leader'],
    // },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    // data: {
    //   roles: ['project_manager', 'group_leader'],
    // },
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./pages/inventory/inventory.module').then(
        (m) => m.InventoryModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pmi-control',
    loadChildren: () =>
      import('./pages/pmi-control/pmi-control.module').then(
        (m) => m.PmiControlModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'report-hazard',
    loadChildren: () =>
      import('./pages/report-hazard/report-hazard.module').then(
        (m) => m.ReportHazardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'search-engine-apu-stand',
    loadChildren: () =>
      import(
        './pages/search-engine-apu-stand/search-engine-apu-stand.module'
      ).then((m) => m.SearchEngineApuStandModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'request-form',
    loadChildren: () =>
      import('./pages/request-form/request-form.module').then(
        (m) => m.RequestFormModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pmi-part-detail',
    loadChildren: () =>
      import('./pages/pmi-part-detail/pmi-part-detail.module').then(
        (m) => m.PmiPartDetailModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'pmi-data',
    loadChildren: () =>
      import('./pages/pmi-data/pmi-data.module').then((m) => m.PmiDataModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'master-destination',
    loadChildren: () =>
      import('./pages/master-destination/master-destination.module').then(
        (m) => m.MasterDestinationModule
      ),
  },
  {
    path: 'master-owner',
    loadChildren: () =>
      import('./pages/master-owner/master-owner.module').then(
        (m) => m.MasterOwnerModule
      ),
  },
  {
    path: 'master-rectification',
    loadChildren: () =>
      import('./pages/master-rectification/master-rectification.module').then(
        (m) => m.MasterRectificationModule
      ),
  },
  {
    path: 'master-part',
    loadChildren: () =>
      import('./pages/master-part/master-part.module').then(
        (m) => m.MasterPartModule
      ),
  },
  {
    path: 'request',
    loadChildren: () =>
      import('./pages/request/request.module').then((m) => m.RequestModule),
  },
  {
    path: 'activity',
    loadChildren: () =>
      import('./pages/activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'request-date',
    loadChildren: () =>
      import('./pages/request-date/request-date.module').then(
        (m) => m.RequestDateModule
      ),
  },
  {
    path: 'request-delivery',
    loadChildren: () =>
      import('./pages/request-delivery/request-delivery.module').then(
        (m) => m.RequestDeliveryModule
      ),
  },

  // Master Data
  {
    path: 'pmi-sheet',
    loadChildren: () =>
      import('./pages/pmi-sheet/pmi-sheet.module').then(
        (m) => m.PmiSheetModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'master-aircraft-type',
    loadChildren: () =>
      import('./pages/master-aircraft-type/master-aircraft-type.module').then(
        (m) => m.MasterAircraftTypeModule
      ),
  },
  {
    path: 'master-engine-type',
    loadChildren: () =>
      import('./pages/master-engine-type/master-engine-type.module').then(
        (m) => m.MasterEngineTypeModule
      ),
  },
  {
    path: 'master-manufacture',
    loadChildren: () =>
      import('./pages/master-manufacture/master-manufacture.module').then(
        (m) => m.MasterManufactureModule
      ),
  },
  {
    path: 'master-category-hazard',
    loadChildren: () =>
      import(
        './pages/master-category-hazard/master-category-hazard.module'
      ).then((m) => m.MasterCategoryHazardModule),
  },
  {
    path: 'master-job-desc',
    loadChildren: () =>
      import('./pages/master-job-desc/master-job-desc.module').then(
        (m) => m.MasterJobDescModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {}
