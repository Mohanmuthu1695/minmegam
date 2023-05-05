import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';

// import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  client_id: string = 'Minvarisai';
  client_secret: string = 'test-secret';
  grant_type: string = 'password';
  // url = 'http://localhost:3002/';
  url = `https://devsalesapi.minmegam.com/`;
  // url = `https://salesapi.minmegam.com/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Origin': '',
      Authorization: this.auth.getAuthToken(),
    }),
  };

  constructor(public http: HttpClient, private auth: AuthService) {}

  post(endpoint: string, data: any) {
    return this.http
      .post(this.url + endpoint, data)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  postForm(endpoint: string, data: any) {
    return this.http
      .post(this.url + endpoint, data)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  // this.http.post('https://smartclean.minmegam.com/api/testimg1', formData).subscribe(
  //     (response) => console.log(response),

  //     (error) => console.log(error)
  //   )
  put(endpoint: string, data?: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, data, reqOpts);
  }
  delete(endpoint: string, data?: any) {
    return this.http.delete(this.url + endpoint, data);
  }

  get(url, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }
    console.log('end', this.url + url);

    //return this.http.get(this.url + '/' + endpoint, reqOpts);
    return this.http.get(this.url + url, reqOpts).pipe(
      //map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response) {
    let body = res;
    // console.log('body', body);
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    if (error.status === 401) {
      console.log('401 un Authorized');
    }
    if (error.status === 503) {
      console.log('error staus', error.status);
      errMsg = "We are currently undergoing maintenance. this won't take long";
      return observableThrowError(error.status);
    }
    console.error(errMsg);

    return observableThrowError(errMsg);
  }

  createEmployee(register: Object): Observable<Object> {
    return this.http.post(`${this.url}`, register, { responseType: 'text' });
  }
}
