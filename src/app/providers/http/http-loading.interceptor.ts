import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import {
  LoadingOverlayRef,
  LoadingService,
} from 'src/app/shared/components/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  closeLoading(): void {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let loadingRef: LoadingOverlayRef;

    // This is a little hacky and related to change detection (ExpressionChangedAfterItHasBeenCheckedError).
    // More informations here:
    // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4

    Promise.resolve(null).then(() => {
      loadingRef = this.loadingService.open();
    });

    return next.handle(req).pipe(
      finalize(() => {
        if (loadingRef) {
          loadingRef.close();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (loadingRef) {
          loadingRef.close();
        }
        return throwError(error);
      })
    );
  }
}
