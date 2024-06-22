import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  isScrolled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @HostListener('window:scroll', ['$event']) // for window scroll events
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
