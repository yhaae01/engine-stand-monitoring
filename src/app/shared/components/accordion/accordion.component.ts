import { AfterContentInit, Component, ComponentFactoryResolver, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';
import { DynamicAccordionsDirective } from './directives/accordion.directive';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements AfterContentInit {
  dynamicAccordions: AccordionItemComponent[] = [];

  selectedAccordion: string = '';

  @ContentChildren(AccordionItemComponent) accordions: QueryList<AccordionItemComponent>;

  @ViewChild(DynamicAccordionsDirective) dynamicAccordionPlaceholder: DynamicAccordionsDirective;

  /*
    Alternative approach of using an anchor directive
    would be to simply get hold of a template variable
    as follows
  */
  // @ViewChild('container', {read: ViewContainerRef}) dynamicAccordionPlaceholder;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {}

  // contentChildren are set
  ngAfterContentInit() {
    // get all active accordions
    const activeAccordions = this.accordions.filter((accordion) => accordion.active);

    // if there is no active accordion set, activate the first
    if (activeAccordions.length === 0) {
      this.selectAccordion(this.accordions.first, 0);
    }
  }

  openAccordion(title: string, template: any, data: any, isCloseable = false) {
    // get a component factory for our AccordionItemComponent
    const componentFactory =
      this._componentFactoryResolver.resolveComponentFactory(AccordionItemComponent);

    // fetch the view container reference from our anchor directive
    const viewContainerRef = this.dynamicAccordionPlaceholder.viewContainer;

    // alternatively...
    // let viewContainerRef = this.dynamicAccordionPlaceholder;

    // create a component instance
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // set the according properties on our component instance
    const instance: AccordionItemComponent = componentRef.instance as AccordionItemComponent;
    instance.title = title;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    // remember the dynamic component for rendering the
    // accordion navigation headers
    this.dynamicAccordions.push(componentRef.instance as AccordionItemComponent);

    // set it active
    this.selectAccordion(this.dynamicAccordions[this.dynamicAccordions.length - 1], 0);
  }

  selectAccordion(accordion: AccordionItemComponent, accordionIndex: number) {
    // deactivate all accordions
    this.accordions.toArray().forEach((accordion) => (accordion.active = false));
    this.dynamicAccordions.forEach((accordion) => (accordion.active = false));

    this.selectedAccordion = 'accordion-'+accordionIndex;

    // activate the accordion the user has clicked on.
    accordion.active = true;
  }

  closeAccordion(accordion: AccordionItemComponent) {
    for (let i = 0; i < this.dynamicAccordions.length; i++) {
      if (this.dynamicAccordions[i] === accordion) {
        // remove the accordion from our array
        this.dynamicAccordions.splice(i, 1);

        // destroy our dynamically created component again
        let viewContainerRef = this.dynamicAccordionPlaceholder.viewContainer;
        // let viewContainerRef = this.dynamicAccordionPlaceholder;
        viewContainerRef.remove(i);

        // set accordion index to 1st one
        this.selectAccordion(this.accordions.first, 0);
        break;
      }
    }
  }

  closeActiveAccordion() {
    const activeAccordions = this.dynamicAccordions.filter((accordion) => accordion.active);
    if (activeAccordions.length > 0) {
      // close the 1st active accordion (should only be one at a time)
      this.closeAccordion(activeAccordions[0]);
    }
  }
}
