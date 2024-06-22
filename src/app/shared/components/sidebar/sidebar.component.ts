import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  RouteHelperService,
  RouteSidebar,
} from 'src/app/core/services/route-helper.service';
import {
  ShowHideType,
  SidebarChildrenGroupMenu,
  SidebarMenu,
} from './interfaces/sidebar.interface';
import { SidebarService } from './sidebar.service';

const _dummysidebar: SidebarMenu[] = [
  {
    link: '/home',
    icon: 'template',
    name: 'Home',
    children: [
      {
        groupName: 'Dashboard',
        groupIcon: 'template',
        details: [
          {
            name: 'Dashboard',
            link: '/dashboard',
          },
          {
            name: 'Detail',
            link: '/detail',
          },
          {
            name: 'Availability Check',
            link: '/availability-check',
          },
          {
            name: 'Request Form',
            link: '/request-form',
          },
        ],
      },
    ],
  },

  // PMI Control
  {
    link: '/pmi-control',
    icon: 'flag',
    name: 'PMI Control',
    children: [
      {
        groupName: 'PMI Control',
        groupIcon: 'flag',
        details: [
          {
            name: 'PMI Control',
            link: '/pmi-control',
          },
          {
            name: 'Insert PMI Data',
            link: '/insert-pmi-data',
          },
        ],
      },
    ],
  },

  // Search Engine APU Stand
  {
    link: '/search-engine-apu-stand',
    icon: 'search-circle',
    name: 'Search Engine Apu Stand',
    children: [
      {
        groupName: 'Search Engine Apu Stand',
        groupIcon: 'search-circle',
        details: [
          {
            name: 'Search Engine Apu Stand',
            link: '/search-engine-apu-stand',
          },
          {
            name: 'Detail Search',
            link: '/detail-search',
          },
        ],
      },
    ],
  },

  // Report Hazard
  {
    link: '/report-hazard',
    icon: 'presentation-chart-bar',
    name: 'Report Hazard',
    children: [
      {
        groupName: 'Report Hazard',
        groupIcon: 'presentation-chart-bar',
        details: [
          {
            name: 'Report Hazard',
            link: '/report-hazard',
          },
          {
            name: 'Add Report Hazard',
            link: '/add-report-hazard',
          },
          {
            name: 'Detail Report Hazard',
            link: '/detail-report-hazard',
          },
        ],
      },
    ],
  },

  // Inventory
  {
    link: '/inventory',
    icon: 'truck',
    name: 'Inventory Management',
    children: [
      {
        groupName: 'Inventory Management',
        groupIcon: 'truck',
        details: [
          {
            name: 'Inventory Management',
            link: '/inventory',
          },
          {
            name: 'Add Data Inventory',
            link: '/add-data-inventory',
          },
          {
            name: 'Detail Inventory',
            link: '/detail-inventory',
          },
          {
            name: 'Outgoing Form',
            link: '/outgoing-form',
          },
        ],
      },
    ],
  },

  // Master Data
  {
    link: '/master_data',
    icon: 'database',
    name: 'Master Data',
    children: [
      {
        groupName: 'User Managements',
        groupIcon: 'refresh',
        details: [
          {
            name: 'Users',
            link: '/sync/project',
          },
          {
            name: 'Roles',
            link: '/sync/zmcms',
          },
          {
            name: 'PMI Sheet',
            link: '/pmi-sheet',
          },
        ],
      },
      {
        groupName: 'Projects',
        groupIcon: 'document-text',
        details: [
          {
            name: 'Category',
            link: '/sync/project',
          },
          {
            name: 'System Log',
            link: '/sync/zmcms',
          },
        ],
      },
    ],
  },

  // User
  {
    link: '/master',
    icon: 'database',
    name: 'Master',
    children: [
      {
        groupName: 'Privileges',
        groupIcon: 'user',
        details: [
          {
            name: 'User',
            link: '/user',
          },
          {
            name: 'PMI Sheet',
            link: '/pmi-sheet',
          },
          {
            name: 'Roles',
            link: '/roles',
          },
          {
            name: 'Position',
            link: '/position',
          },
          {
            name: 'Employees',
            link: '/employees',
          },
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          zIndex: 50,
        })
      ),
      state(
        'hide',
        style({
          zIndex: -50,
        })
      ),
      transition('show => hide', [animate('0.1s')]),
      transition('hide => show', [animate('0.9s')]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  sidebarState: ShowHideType = 'hide';

  public sidebarState$ = new BehaviorSubject<ShowHideType>('hide');
  public subMenuTitle$ = new BehaviorSubject<string>('');
  public sidebarRoute: RouteSidebar[] = [];

  public subMenu!: SidebarChildrenGroupMenu[];
  public activeBasePath: string = '';

  constructor(
    private _router: RouteHelperService,
    private _sidebar: SidebarService
  ) {}

  ngOnInit(): void {
    /**
     * Creating routes for main sidebar
     *
     */
    RouteHelperService.createSidebarRoute(
      { path: 'home', icon: 'template' },
      this._router.router.config
    );
    RouteHelperService.createSidebarRoute(
      { path: 'search-engine-apu-stand', icon: 'search-circle' },
      this._router.router.config
    );
    RouteHelperService.createSidebarRoute(
      { path: 'inventory', icon: 'truck' },
      this._router.router.config
    );
    RouteHelperService.createSidebarRoute(
      { path: 'pmi-control', icon: 'flag' },
      this._router.router.config
    );
    RouteHelperService.createSidebarRoute(
      { path: 'report-hazard', icon: 'presentation-chart-bar' },
      this._router.router.config
    );
    RouteHelperService.createSidebarRoute(
      { path: 'master-data', icon: 'database' },
      this._router.router.config
    );

    /**
     *
     *
     *
     */
    this.subMenu = RouteHelperService.groupRoute;
    this.activeBasePath = this._router.getBasePath();
    this.sidebarRoute = RouteHelperService.sidebarRoute;
  }

  capitalize(input: string, nextIndex: number): string {
    const _first = input.substring(1, input.length).charAt(0).toUpperCase();
    return `${_first}${input.slice(nextIndex)}`;
  }

  toggleSidebar(): void {
    this._sidebar.subMenuTitle$.next(
      this.capitalize(this._router.router.url, 2)
    );

    this._router.router.events.subscribe((event: Event) => {
      if (
        event instanceof NavigationStart &&
        this._sidebar.sidebarState$.getValue() === 'show'
      ) {
        this._sidebar.hideSidebar();
      }

      if (
        event instanceof NavigationEnd &&
        this._sidebar.sidebarState$.getValue() === 'hide' &&
        this._router.removeFirstSlash(this._router.router.url).split('/')
          .length <= 1
      ) {
        this.activeBasePath = this._router.removeFirstSlash(event.url);
        setTimeout(() => {
          this.subMenu = RouteHelperService.groupRoute.filter(
            (route) => route.groupBasePath === this._router.getBasePath()
          );
          this._sidebar.showSidebar();
          this._sidebar.subMenuTitle$.next(this.capitalize(event.url, 2));
        }, 200);
      }

      return;
    });

    this._sidebar.toggleSidebar();
  }

  getSidebar() {
    return this._sidebar;
  }

  getSidebarCurrentValue() {
    return this._sidebar.sidebarState$.getValue();
  }
}
