import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpUserEvent,
  HttpResponse,
  HttpProgressEvent,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { CommonService } from './config/common.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private api: ApiService,
    private shared: CommonService
  ) {}
  credentials = `${this.api.client_id}` + ':' + `${this.api.client_secret}`;

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
    | any
  > {
    return next.handle(
      this.addTokenToRequest(request, this.auth.getAuthToken())
    );

    // .pipe(
    //     catchError(err => {
    //         if (err instanceof HttpErrorResponse) {

    //         } else {
    //             return throwError(err);
    //         }
    //     }));
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    // let Authtoken = token;

    if (!this.shared.getCurrentUser()) {
      return (request = request.clone({
        setHeaders: {
          Authorization: `Basic ${window.btoa(this.credentials)}`,
        },
      }));
    } else {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }
}
