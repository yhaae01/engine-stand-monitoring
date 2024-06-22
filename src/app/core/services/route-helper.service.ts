import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { HeroIconName } from 'ng-heroicon';
import {
  BehaviorSubject,
  Observable,
  from,
  map,
  of,
  switchMap
} from 'rxjs';

export interface SidebarChildrenMenu {
  name: string;
  link?: string;
}

export interface SidebarChildrenGroupMenu {
  groupBasePath: string;
  groupName: string;
  groupIcon: HeroIconName;
  details: SidebarChildrenMenu[];
}

export interface CreateRouteGroupDTO {
  basePath: string;
  groupIcon: HeroIconName;
  path: string;
  route: Route[];
}

export interface RouteSidebar {
  path: string;
  icon: HeroIconName;
  name: string;
}

export type RouteLevel = '1' | '2' | '3' | '4';

@Injectable({
  providedIn: 'root',
})
export class RouteHelperService {
  public groupRoute$ = new BehaviorSubject<SidebarChildrenGroupMenu[]>([]);
  public navigationEnd$!: Observable<NavigationEnd>;
  public subRouteParams$!: Observable<string | null>;

  public static groupRoute: SidebarChildrenGroupMenu[] = [];
  public static sidebarRoute: RouteSidebar[] = [];

  constructor(public router: Router, public route: ActivatedRoute) {}

  getRouterEvent() {
    return this.router.events;
  }

  getBasePath() {
    return this.removeFirstSlash(this.router.url);
  }

  getBreadcrumb() {
    return this.removeFirstSlash(this.router.url).replace(/\//gi, '  >  ');
  }

  getFirstPath() {
    const _first = this.removeFirstSlash(this.router.url).split('/');
    return _first.length !== 0 ? _first[0] : '';
  }

  getLoadedRoutes() {
    if (this.router.config.length !== 0) {
      const _a = this.router.url.substring(1, this.router.url.length);
      const _b = this.router.config.filter((r) => r.path === _a);
      const _c = _b[0];
      const _d: Route[] = (<any>_c)['_loadedRoutes'];
      const _e = _d.filter((route) => route.path !== '');
      return _e;
    }

    throw new Error('no routes');
  }

  static createRouteGroup(groupName: string, params: CreateRouteGroupDTO) {
    if (
      this.groupRoute.filter((route) => route.groupName === groupName)
        .length !== 0
    ) {
      return;
    }

    let _temporary: SidebarChildrenGroupMenu = {
      groupBasePath: params.basePath,
      groupName: groupName,
      groupIcon: params.groupIcon,
      details: [],
    };

    const _route = params.route.filter((route) => route.path === params.path);

    _route[0].children?.forEach((value) => {

      if(!value.path?.includes(":")) {

        let _tempchild: SidebarChildrenMenu = {
          name: this.capitalizeadv(value.path as string, 0, 1),
          link: `${params.basePath}/${params.path}/${value.path}`,
        };
        _temporary.details.push(_tempchild);
      }
    });

    this.groupRoute.push(_temporary);
  }

  static createSidebarRoute(
    params: { path: string; icon: HeroIconName },
    routes: Route[]
  ) {
    if (
      this.sidebarRoute.filter((route) => route.path === params.path).length !==
      0
    ) {
      return;
    }

    routes
      .filter((route) => route.path !== '**')
      .filter((route) => route.path === params.path)
      .forEach((value, index) => {
        let _a: RouteSidebar = {
          path: value.path as string,
          icon: value.path === params.path ? params.icon : 'emoji-sad',
          name: this.capitalizeadv(params.path, 0, 1),
        };
        this.sidebarRoute.push(_a);
      });
  }

  private capitalize(input: string, nextIndex: number): string {
    const _first = input.substring(1, input.length).charAt(0).toUpperCase();
    return `${_first}${input.slice(nextIndex)}`;
  }

  private capitalizeadv(
    input: string,
    startIndex: number,
    nextIndex: number
  ): string {
    const _first = input
      .substring(startIndex, input.length)
      .charAt(0)
      .toUpperCase();
    return `${_first}${input.slice(nextIndex)}`;
  }

  private static capitalizeadv(
    input: string,
    startIndex: number,
    nextIndex: number
  ): string {
    const _first = input
      .substring(startIndex, input.length)
      .charAt(0)
      .toUpperCase();
    return `${_first}${input.slice(nextIndex)}`;
  }

  public removeFirstSlash(input: string) {
    return input.substring(1, input.length);
  }

  public static removeFirstSlash(input: string) {
    return input.substring(1, input.length);
  }

  public getRouteParams(paramsName: string, level: RouteLevel, router: any) {
    const _temp = from(router).pipe(
      map(() => this.route.root),
      map((root) => root.firstChild)
    );

    switch (level) {
      default:
        return _temp.pipe(
          switchMap((firstChild) =>
            firstChild
              ? firstChild.paramMap.pipe(map((param) => param.get(paramsName)))
              : of(null)
          )
        );

      case '2':
        return _temp.pipe(
          switchMap((firstChild) =>
            firstChild?.firstChild
              ? firstChild.firstChild.paramMap.pipe(
                  map((param) => param.get(paramsName))
                )
              : of(null)
          )
        );

      case '3':
        return _temp.pipe(
          switchMap((firstChild) =>
            firstChild?.firstChild?.firstChild
              ? firstChild.firstChild.firstChild.paramMap.pipe(
                  map((param) => param.get(paramsName))
                )
              : of(null)
          )
        );

      case '4':
        return _temp.pipe(
          switchMap((firstChild) =>
            firstChild?.firstChild?.firstChild?.firstChild
              ? firstChild.firstChild.firstChild.firstChild.paramMap.pipe(
                  map((param) => param.get(paramsName))
                )
              : of(null)
          )
        );
    }

    // this.router.events.pipe(
    //   tap((event) => console.log("Tapping: ",event))
    // ).subscribe(value => console.log(value));
    // this.subRouteParams$ = this.navigationEnd$.pipe(
    //   map(() => this.route.root),
    //   map(root => root.firstChild),
    //   switchMap(firstChild => {
    //     if(firstChild && firstChild?.firstChild) {
    //       return firstChild.firstChild.paramMap.pipe(map(paramMap => paramMap.get(paramsName)));
    //     }

    //     return of(null);
    //   })
    // )

    // https://tomastrajan.medium.com/how-to-get-route-path-parameters-in-non-routed-angular-components-32fc90d9cb52
  }
}
