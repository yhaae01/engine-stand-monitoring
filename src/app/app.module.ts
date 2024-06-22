import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  KeycloakAngularModule,
  KeycloakBearerInterceptor,
  KeycloakService,
} from 'keycloak-angular';
import * as te from 'tw-elements';

te;

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { HeroIconModule, allIcons } from 'ng-heroicon';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { DateFnsModule } from 'ngx-date-fns';
import { ToastrModule } from 'ngx-toastr';
import { MasterAircraftDataService } from './core/services/master-aircraft-data.service';
import { RequestDataService } from './core/services/request-data.service';
import { UserDataService } from './core/services/user-data.service';
import { HttpHeaderInterceptor } from './providers/http/http-header.interceptor';
import { SharedModule } from './shared/shared.module';
import { ReviewService } from './core/services/review.service';
import { LoadingService } from './shared/components/loading/loading.service';
import { LoadingInterceptor } from './providers/http/http-loading.interceptor';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakUrl,
        realm: environment.realm,
        clientId: environment.keycloakClientId,
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['assets/'],
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        // silentCheckSsoRedirectUri:
        //   window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    DateFnsModule.forRoot(),
    HeroIconModule.forRoot(
      { ...allIcons },
      {
        defaultHostDisplay: 'inlineBlock', // default 'none'
        attachDefaultDimensionsIfNoneFound: true, //
      }
    ),
    // TODO: Remove depedency packages from package.json
    // GraphQLModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ToastrModule.forRoot(),
  ],

  providers: [
    UserDataService,
    MasterAircraftDataService,
    RequestDataService,
    ReviewService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  ngDoBootstrap(app) {
    initializeKeycloak(new KeycloakService());
  }
}
