import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subject, takeUntil } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { UserDataDTO } from 'src/app/core/dto/user-data.dto';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  userData: UserDataDTO = <UserDataDTO>{};
  _isDestroy: Subject<boolean> = new Subject<boolean>();
  userPhoto: string;

  @Output()
  sidebarStatus = new EventEmitter<boolean>();

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly userDataService: UserDataService
  ) {}

  ngOnDestroy(): void {
    this._isDestroy.next(true);
    this._isDestroy.unsubscribe();
  }

  ngOnInit(): void {
    this.getUserData();

    this.userPhoto =
      'https://talentlead.gmf-aeroasia.co.id/images/avatar/' +
      this.keycloakService.getUsername() +
      '.jpg';
  }

  getUserData(): void {
    this.userDataService
      .getUser()
      .pipe(takeUntil(this._isDestroy))
      .subscribe((response) => (this.userData = response.body));
  }

  defaultPhoto(event: any) {
    event.target.src = '../../../assets/images/default.png';
  }

  sidebarToggle(): boolean {
    if (this.isSidebarOpen == true) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }

    this.sidebarStatus.emit(this.isSidebarOpen);
    return this.isSidebarOpen;
  }

  @Confirmable({
    title: 'Logout Confirmation',
    html: 'Are you sure you want to logout?',
    icon: 'question',
  })
  doLogout(): void {
    this.clearStorage();
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
