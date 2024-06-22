import { HeroIconName } from "ng-heroicon";

export type ShowHideType = 'show' | 'hide';

export interface SidebarMenu {
  link: string;
  icon: HeroIconName;
  name: string;
  children: SidebarChildrenGroupMenu[];
}

export interface SidebarChildrenMenu {
  name: string;
  link?: string;
  icon?: HeroIconName;
}

export interface SidebarChildrenGroupMenu {
  groupName: string;
  groupIcon: HeroIconName;
  details: SidebarChildrenMenu[];
}
