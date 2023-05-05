import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './config/common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  regtoken: any;
  logtoken: any;
  private addUsuarioSource = new BehaviorSubject<string>('false');
  public addUsuario$ = this.addUsuarioSource.asObservable();
  constructor(public sharedService: CommonService) {
    // this.getAddUsuario();
  }
  getAuthToken(): string {
    // console.log('uuu')
    // let currentUser:any = localStorage.getItem('LoginData');
    let currentUser = this.sharedService.getCurrentUser();
    // console.log('tokens', currentUser);
    if (currentUser?.access_token != null) {
      // console.log('currentUser?.access_token', currentUser?.access_token);

      return currentUser.access_token;
    } else {
      return '';
    }
  }
}
