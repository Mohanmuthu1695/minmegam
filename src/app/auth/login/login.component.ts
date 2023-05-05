import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CommonService } from 'src/app/providers/config/common.service';
import { configService } from 'src/app/providers/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  showUsername: boolean = true;
  loginForm: FormGroup;
  next: boolean;
  submit: boolean;
  config: any;
  uName: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    private configService: configService,
    private common: CommonService
  ) {
    this.config = this.configService.config;
  }

  ngOnInit(): void {
    this.loadLoginForm();
    if (this.auth.getAuthToken()) {
      // console.log('auth', this.auth.getAuthToken());
      this.router.navigate(['/']);
    }
  }

  loadLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [''],
    });
  }
  get loginFormControls() {
    return this.loginForm.controls;
  }
  onNext() {
    this.next = true;
    console.log('invalid', this.loginForm.invalid);
    if (this.loginForm.invalid) return;
    console.log('in next');

    console.log('on next', this.loginForm.value.username);
    let data = {
      username: this.loginForm.value.username,
    };
    this.loginForm.get('password').addValidators(Validators.required);
    this.api.post(this.config.routes.checkUserName, data).subscribe(
      (resp: any) => {
        try {
          if (resp.status == true) {
            this.showPassword = true;
            this.showUsername = false;
            this.uName = resp.uname;
            console.log('resp', resp);
          } else if (resp.status == false) {
            Swal.fire({
              title: 'error',
              icon: 'error',
              text: resp.message,
            });
          }
          // this.respData = resp.data;
          // console.log(this.respData);
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.error(err);
      },
      () => {}
    );
  }
  onSubmit() {
    this.submit = true;
    if (this.loginForm.invalid) return;
    console.log('on submit', this.loginForm.value.password);
    let data = {
      username: this.uName,
      password: this.loginForm.value.password,
    };
    this.api.post(this.config.routes.login, data).subscribe(
      (resp: any) => {
        try {
          if (resp.status == true) {
            console.log('resp', resp);
            let respData: any = {
              type: resp.uType,
              name: resp.uName,
              access_token: resp.accessToken,
              uid: resp.uId,
              userName: resp.userName,
            };
            this.common.setCurrentUser(respData);
            // console.log('resdatqa', respData);
            Swal.fire({
              // title: 'Are you sure?',
              text: resp.message,
              icon: 'success',
              // showCancelButton: true,
              // confirmButtonColor: '#3085d6',
              // cancelButtonColor: '#d33',
              // confirmButtonText: 'OK',
              timer: 2000,
            });
            setTimeout(() => {
              if (resp.uType == 'SALES')
                this.router.navigate(['/customer-list']);
              else {
                this.router.navigate(['/admin']);
              }
            }, 500);
          }

          if (resp.status == false) {
            Swal.fire({
              // title: 'Are you sure?',
              text: resp.message,
              icon: 'error',
              // showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK',
            });
          }
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.error(err);
      },
      () => {}
    );
  }
 
}
