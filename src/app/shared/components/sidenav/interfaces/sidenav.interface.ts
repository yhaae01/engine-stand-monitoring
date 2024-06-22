import { HeroIconName } from 'ng-heroicon';

export interface SidenavMenu {
  link?: string;
  selector: string;
  icon: HeroIconName;
  name: string;
  panelId?: string;
  children?: SidenavSubMenu[];
}

export interface SidenavSubMenu {
  link?: string;
  icon: HeroIconName;
  name: string;
}
