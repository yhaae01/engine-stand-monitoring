import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ShowHideType = 'show' | 'hide';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarState: ShowHideType = 'hide';
  public sidebarState$ = new BehaviorSubject<ShowHideType>('hide');
  public subMenuTitle$ = new BehaviorSubject<string>('');
  public currentState$ = this.sidebarState$.asObservable();

  constructor() {}

  getCurrentSidebarState() {
    return this.currentState$;
  }

  showSidebar(): void {
    this.sidebarState$.next('show');
  }

  hideSidebar(): void {
    this.sidebarState$.next('hide');
  }

  toggleSidebar(): void {
    this.sidebarState$.getValue() === 'show' ? this.hideSidebar() : this.showSidebar();
  }
}
