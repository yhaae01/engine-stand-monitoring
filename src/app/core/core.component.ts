import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageServiceInterface } from './interfaces/localstorage.service.interface';
import { PersonalInformationDetail } from './services/user-info.service';

export abstract class CoreComponent {
  isScrolled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  localStorage: LocalStorageServiceInterface;

  getLocalUserInfo(): PersonalInformationDetail {
    return this.localStorage.getData('USER_INFO').toObject<PersonalInformationDetail>();
  }

  onScroll(event: any) {
    const verticalOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (verticalOffset > 48) {
      this.isScrolled$.next(false);
    } else {
      this.isScrolled$.next(true);
    }
  }
}
