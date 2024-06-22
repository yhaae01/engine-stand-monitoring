import { AfterContentInit, Component, ComponentFactoryResolver, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { TabItemComponent } from './components/tab-item/tab-item.component';
import { DynamicTabsDirective } from './directives/tab.directive';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements AfterContentInit {
  dynamicTabs: TabItemComponent[] = [];

  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent>;

  @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;

  /*
    Alternative approach of using an anchor directive
    would be to simply get hold of a template variable
    as follows
  */
  // @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  openTab(title: string, template: any, data: any, isCloseable = false) {
    // get a component factory for our TabItemComponent
    const componentFactory =
      this._componentFactoryResolver.resolveComponentFactory(TabItemComponent);

    // fetch the view container reference from our anchor directive
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

    // alternatively...
    // let viewContainerRef = this.dynamicTabPlaceholder;

    // create a component instance
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // set the according properties on our component instance
    const instance: TabItemComponent = componentRef.instance as TabItemComponent;
    instance.title = title;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    // remember the dynamic component for rendering the
    // tab navigation headers
    this.dynamicTabs.push(componentRef.instance as TabItemComponent);

    // set it active
    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  selectTab(tab: TabItemComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    this.dynamicTabs.forEach((tab) => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  closeTab(tab: TabItemComponent) {
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        // remove the tab from our array
        this.dynamicTabs.splice(i, 1);

        // destroy our dynamically created component again
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        // let viewContainerRef = this.dynamicTabPlaceholder;
        viewContainerRef.remove(i);

        // set tab index to 1st one
        this.selectTab(this.tabs.first);
        break;
      }
    }
  }

  closeActiveTab() {
    const activeTabs = this.dynamicTabs.filter((tab) => tab.active);
    if (activeTabs.length > 0) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeTabs[0]);
    }
  }
}
