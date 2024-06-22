import { Component, Input, OnInit } from '@angular/core';
import { SidenavMenu } from './interfaces/sidenav.interface';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

const _sidenavMenu: SidenavMenu[] = [
  {
    selector: 'home',
    link: '/home',
    icon: 'template',
    name: 'Dashboard',
  },
  {
    selector: 'request-form',
    icon: 'ticket',
    name: 'Request Form',
    link: '/request-form',
  },
  {
    selector: 'search-engine-apu-stand',
    link: '/search-engine-apu-stand',
    icon: 'search-circle',
    name: 'Search Engine/Apu ',
  },
  {
    selector: 'inventory',
    link: '/inventory',
    icon: 'truck',
    name: 'Inventory',
  },
  {
    selector: 'pmi-control',
    link: '/pmi-control',
    icon: 'flag',
    name: 'PMI Control',
  },
  {
    selector: 'report-hazard',
    link: '/report-hazard',
    icon: 'presentation-chart-bar',
    name: 'Report Hazard',
  },

  {
    selector: 'master-data',
    icon: 'database',
    name: 'Master Data',
    panelId: 'collapseMasterData',
    children: [
      {
        link: '/pmi-sheet',
        icon: 'sparkles',
        name: 'PMI Sheet',
      },
      {
        link: '/master-engine-type',
        icon: 'cog',
        name: 'Engine Type',
      },
      {
        link: '/master-aircraft-type',
        icon: 'paper-airplane',
        name: 'Aircraft Type',
      },
      {
        link: '/master-manufacture',
        icon: 'bookmark',
        name: 'Manufacture',
      },
      {
        link: '/master-category-hazard',
        icon: 'clipboard',
        name: 'Category Hazard',
      },
      {
        link: '/master-job-desc',
        icon: 'briefcase',
        name: 'Job Desc',
      },
      {
        link: '/master-destination',
        icon: 'fire',
        name: 'Destination',
      },
      {
        link: '/master-rectification',
        icon: 'cube-transparent',
        name: 'Rectification',
      },
    ],
  },
];

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  sidenavRoute: Array<any>;
  currentRoute: string;
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

  @Input()
  isSidebarOpen: boolean = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url.replace('/', '');
        }
      });
  }

  isChildActive(parent: SidenavMenu): boolean {
    if (!parent.children) {
      return false;
    }

    let currentRoute = this.currentRoute;
    let isPresent = parent.children.some(function (e) {
      return e.link === currentRoute;
    });

    return isPresent;
  }

  ngOnInit(): void {
    this.sidenavRoute = _sidenavMenu;
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.unsubscribe();
  }
}
