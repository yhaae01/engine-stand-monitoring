import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroIconModule } from 'ng-heroicon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionItemComponent } from './components/accordion/components/accordion-item/accordion-item.component';
import { ButtonComponent } from './components/button/button.component';
import { ContainerComponent } from './components/container/container.component';
import { HeaderbarComponent } from './components/headerbar/headerbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { SelectComponent } from './components/select/select.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TabItemComponent } from './components/tab/components/tab-item/tab-item.component';
import { TabComponent } from './components/tab/tab.component';
import { TooltipModule } from './modules/tooltip/tooltip.module';
import { RemoveHtmlPipe } from './pipes/remove-html.pipe';
import { TransformTitleCasePipe } from './pipes/transform-title-case.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RatingModule } from 'ng-starrating';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RemoveHtmlPipe,
    LayoutComponent,
    SidebarComponent,
    SelectComponent,
    HeaderbarComponent,
    ModalComponent,
    TransformTitleCasePipe,
    ContainerComponent,
    LoadingComponent,
    ButtonComponent,
    TabComponent,
    TabItemComponent,

    AccordionComponent,
    AccordionItemComponent,
    NavbarComponent,
    SidenavComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    InfiniteScrollModule,
    HeroIconModule,
    TooltipModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule,
    NgSelectModule,
  ],
  exports: [
    RemoveHtmlPipe,
    LayoutComponent,
    HeaderbarComponent,
    ModalComponent,
    SelectComponent,
    ContainerComponent,
    ButtonComponent,
    LoadingComponent,
    TabComponent,
    TabItemComponent,

    AccordionComponent,
    AccordionItemComponent,
  ],
})
export class SharedModule {}
