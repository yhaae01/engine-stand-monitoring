import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input()
  tooltip: string = 'Default';

  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef === null) {
      this.componentRef = this.viewContainer.createComponent(TooltipComponent, {
        injector: this.injector,
      });

      if (this.appRef.destroyed) {
        this.appRef.attachView(this.componentRef.hostView);
        const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
      }
      this.setTooltipComponentProperties();
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      const { left, right, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.left = (right - left) / 2 + left;
      this.componentRef.instance.top = bottom;
      this.componentRef.instance.isTooltipShow = true;
    }
    
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.componentRef.instance.isTooltipShow = false;
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
