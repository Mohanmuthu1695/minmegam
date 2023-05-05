import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getUser: any;
  constructor(private router: Router) {}
  public setCurrentUser(userDetails) {
    this.getUser = userDetails;
    // console.log('getuser data', this.getUser);
    // localStorage.setItem(
    //   'currentUser' + userDetails.type + userDetails.uid,
    //   JSON.stringify(userDetails)
    // );
    localStorage.setItem('currentUser', JSON.stringify(userDetails));
  }
  public getCurrentUser() {
    let current = JSON.parse(localStorage.getItem('currentUser'));

    if (current != null) {
      console.log('get data user', current);
      return current;
      // JSON.parse(
      //   localStorage.getItem('currentUser' + current.type + current.uid)
      // );
    } else {
      return this.router.navigateByUrl('/');
    }
  }
  public removeCurrentUser() {
    return localStorage.removeItem('currentUser');
  }
}
