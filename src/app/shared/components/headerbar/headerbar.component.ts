import { Component, Input, OnInit } from '@angular/core';
import { RouteHelperService } from 'src/app/core/services/route-helper.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {

  @Input()
  title: string = 'Default Title';

  @Input()
  subTitle: string = 'Default Sub Title';

  @Input('bgcolor')
  bgColor: string = 'bg-white';

  @Input('title-color')
  titleColor: string = 'text-black';

  @Input('subtitle-color')
  subTitleColor: string = '';
  _title!: string;

  constructor(private sidebar: SidebarService, private route: RouteHelperService) { 
  }

  ngOnInit(): void {
    this._title = this.route.getFirstPath();
  }

  showSidebar() {
    this.sidebar.showSidebar();
  }

  toggleSidebar() {
    this.sidebar.toggleSidebar();
  }

  getCurrentSidebarState() {
    return this.sidebar.sidebarState$.getValue();
  }

  getSidebar() {
    return this.sidebar;
  }

}
